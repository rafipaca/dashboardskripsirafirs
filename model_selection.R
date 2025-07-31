# Load library yang diperlukan
library(MASS)      # Untuk glm.nb
library(car)       # Untuk vif
library(lmtest)    # Untuk bptest

# Fungsi untuk mengevaluasi model berdasarkan VIF, BP test, dan McFadden R2 (METODE MANUAL)
evaluate_model <- function(formula, data) {
  model <- try(glm.nb(formula, data = data), silent = TRUE)
  
  if(inherits(model, "try-error")) {
    return(list(
      formula = formula,
      model = NULL,
      max_vif = Inf,
      bp_pvalue = 1,
      aic = Inf,
      mcfadden_r2 = -Inf
    ))
  }
  
  # Hitung VIF
  vif_values <- try(vif(model), silent = TRUE)
  if(inherits(vif_values, "try-error")) {
    max_vif <- Inf
  } else {
    max_vif <- max(vif_values)
  }
  
  # Hitung BP test p-value
  bp_test <- try(bptest(model), silent = TRUE)
  if(inherits(bp_test, "try-error")) {
    bp_pvalue <- 1
  } else {
    bp_pvalue <- bp_test$p.value
  }
  
  # Hitung AIC
  aic <- AIC(model)
  
  # Hitung McFadden's R-squared menggunakan metode manual dari user
  mcfadden_r2 <- -Inf # Default jika error
  
  try({
    # Ekstrak komponen dari model yang sedang dievaluasi
    datay <- as.matrix(model$y)
    datax <- model.matrix(model)
    tetanb <- model$theta
    betanb <- as.matrix(model$coefficients)
    
    # Hitung mu untuk model nol (hanya intercept)
    muw <- as.matrix(rep(exp(betanb[1]), nrow(datay)))
    
    # Perhitungan slr sesuai kode user
    slr <- matrix(0, nrow(datay), 1)
    for(i in 1:nrow(datay)){
      if (datay[i] > 0) {
        for(r in 1:datay[i]){
            slr[i] <- slr[i] + log(r + (1 / tetanb))
        }
      }
    }

    # Hitung Lw (Log-likelihood model nol)
    Lw <- sum(slr - lgamma(datay + 1) + datay * log(tetanb * muw) - (datay + (1 / tetanb)) * log(1 + tetanb * muw))
    
    # Hitung mu untuk model lengkap
    muo <- exp(datax %*% betanb)
    
    # Hitung Lo (Log-likelihood model lengkap)
    Lo <- sum(slr - lgamma(datay + 1) + datay * log(tetanb * muo) - (datay + (1 / tetanb)) * log(1 + tetanb * muo))
    
    # Hitung McFadden R-squared
    if (is.finite(Lo) && is.finite(Lw) && Lw != 0) {
      mcfadden_r2 <- 1 - (Lo / Lw)
    }
  }, silent = TRUE)
  

  return(list(
    formula = formula,
    model = model,
    max_vif = max_vif,
    bp_pvalue = bp_pvalue,
    aic = aic,
    mcfadden_r2 = mcfadden_r2
  ))
}

# Daftar semua variabel prediktor potensial, kecuali Imunisasi
all_vars <- c("PM25","PM10", "NTL", 
              "Kemiskinan","Kepadatan","CurahHujanSum","Sanitasi", "AirMinum", "GiziKurang", 
              "IMD", "K6","RasioPuskesmas","RokokPerkapita")

# Inisialisasi
vif_threshold <- 7 # Batas VIF yang dapat diterima
bp_threshold <- 0.05 # Batas p-value BP test yang diinginkan
candidate_models <- list()

# Coba kombinasi dengan minimal 8 variabel
min_vars <- 6
max_vars <- min(10, length(all_vars))  # Batasi hingga 10 variabel untuk menghindari overfitting

# Fungsi untuk menghasilkan semua kombinasi
generate_combinations <- function(vars, size) {
  combn(vars, size, simplify = FALSE)
}

# Evaluasi model untuk berbagai kombinasi variabel
for (size in min_vars:max_vars) {
  cat("Mengevaluasi kombinasi dengan", size, "variabel...\n")
  combinations <- generate_combinations(all_vars, size)
  
  total_combinations <- length(combinations)
  cat("Total", total_combinations, "kombinasi untuk dievaluasi\n")
  
  if (total_combinations > 1000) {
    set.seed(123)
    sample_size <- min(1000, total_combinations)
    combinations <- sample(combinations, sample_size)
    cat("Terlalu banyak kombinasi, mengambil sampel", sample_size, "kombinasi secara acak\n")
    total_combinations <- sample_size
  }
  
  for (i in 1:total_combinations) {
    if (i %% 50 == 0) cat("Progress:", i, "/", total_combinations, "\n")
    
    vars <- combinations[[i]]
    formula_str <- paste("Penemuan ~", paste(vars, collapse = " + "))
    formula_obj <- as.formula(formula_str)
    
    eval_result <- evaluate_model(formula_obj, datapn3jawa)
    
    if (!is.null(eval_result$model) && eval_result$max_vif < vif_threshold) {
      candidate_models[[formula_str]] <- eval_result
    }
  }
  
  heteroskedastic_models <- Filter(function(m) m$bp_pvalue < bp_threshold, candidate_models)
  if (length(heteroskedastic_models) >= 5) {
    cat("Ditemukan", length(heteroskedastic_models), "model dengan heteroskedastisitas. Menghentikan pencarian.\n")
    break
  }
}

# Filter model-models dengan heteroskedastisitas (BP test < 0.05)
heteroskedastic_models <- Filter(function(m) m$bp_pvalue < bp_threshold, candidate_models)

# Jika ada model dengan heteroskedastisitas, urutkan berdasarkan McFadden R2
if (length(heteroskedastic_models) > 0) {
  # Urutkan model berdasarkan McFadden R2 secara menurun (tertinggi ke terendah)
  sorted_models <- heteroskedastic_models[order(sapply(heteroskedastic_models, function(m) m$mcfadden_r2), decreasing = TRUE)]
  
  # Filter tambahan: AIC < 1741.89
  aic_threshold <- 1741.89
  sorted_models <- Filter(function(m) !is.null(m) && !is.na(m$aic) && m$aic < aic_threshold, sorted_models)
  
  cat("\nModel-models dengan heteroskedastisitas (BP test < 0.05), diurutkan berdasarkan McFadden R2 (tertinggi) dan AIC < ", aic_threshold, ":\n\n")
  
  if (length(sorted_models) > 0) {
    for (i in 1:min(5, length(sorted_models))) {
      model <- sorted_models[[i]]
      cat("Model", i, ":\n")
      print(model$formula)
      cat("McFadden R2:", model$mcfadden_r2, "\n")
      cat("AIC:", model$aic, "\n")
      cat("Max VIF:", model$max_vif, "\n")
      cat("BP test p-value:", model$bp_pvalue, "\n\n")
      
      cat("Ringkasan model:\n")
      print(summary(model$model))
      
      cat("VIF:\n")
      print(vif(model$model))
      cat("\n-------------------------------------------\n\n")
    }
    
    best_model <- sorted_models[[1]]
  } else {
    cat("Tidak ditemukan model yang memenuhi kriteria (heteroskedastisitas, VIF < 7, dan AIC < ", aic_threshold, ").\n")
  }
  
} else {
  cat("Tidak ditemukan model yang memenuhi kriteria heteroskedastisitas dengan VIF < 7.\n")
  cat("Mencoba dengan kriteria VIF yang lebih longgar (VIF < 15)...\n\n")
  
  vif_threshold <- 15
  
  for (size in min_vars:max_vars) {
    cat("Mengevaluasi kombinasi dengan", size, "variabel (VIF < 15)...\n")
    combinations <- generate_combinations(all_vars, size)
    
    total_combinations <- length(combinations)
    cat("Total", total_combinations, "kombinasi untuk dievaluasi\n")
    
    if (total_combinations > 1000) {
      set.seed(123)
      sample_size <- min(1000, total_combinations)
      combinations <- sample(combinations, sample_size)
      cat("Terlalu banyak kombinasi, mengambil sampel", sample_size, "kombinasi secara acak\n")
      total_combinations <- sample_size
    }
    
    for (i in 1:total_combinations) {
      if (i %% 50 == 0) cat("Progress:", i, "/", total_combinations, "\n")
      
      vars <- combinations[[i]]
      formula_str <- paste("Penemuan ~", paste(vars, collapse = " + "))
      
      if (formula_str %in% names(candidate_models)) next
      
      formula_obj <- as.formula(formula_str)
      eval_result <- evaluate_model(formula_obj, datapn3jawa)
      
      if (!is.null(eval_result$model) && eval_result$max_vif < vif_threshold) {
        candidate_models[[formula_str]] <- eval_result
      }
    }
    
    heteroskedastic_models <- Filter(function(m) m$bp_pvalue < bp_threshold, candidate_models)
    if (length(heteroskedastic_models) >= 5) {
      cat("Ditemukan", length(heteroskedastic_models), "model dengan heteroskedastisitas. Menghentikan pencarian.\n")
      break
    }
  }
  
  heteroskedastic_models <- Filter(function(m) m$bp_pvalue < bp_threshold, candidate_models)
  
  if (length(heteroskedastic_models) > 0) {
    # Urutkan berdasarkan McFadden R2 (tertinggi ke terendah)
    sorted_models <- heteroskedastic_models[order(sapply(heteroskedastic_models, function(m) m$mcfadden_r2), decreasing = TRUE)]
    
    # Filter tambahan: AIC < 1741.89
    aic_threshold <- 1741.89
    sorted_models <- Filter(function(m) !is.null(m) && !is.na(m$aic) && m$aic < aic_threshold, sorted_models)
    
    cat("\nModel-models dengan heteroskedastisitas (BP test < 0.05), VIF < 15, diurutkan berdasarkan McFadden R2 (tertinggi) dan AIC < ", aic_threshold, ":\n\n")
    
    if (length(sorted_models) > 0) {
      for (i in 1:min(5, length(sorted_models))) {
        model <- sorted_models[[i]]
        cat("Model", i, ":\n")
        print(model$formula)
        cat("McFadden R2:", model$mcfadden_r2, "\n")
        cat("AIC:", model$aic, "\n")
        cat("Max VIF:", model$max_vif, "\n")
        cat("BP test p-value:", model$bp_pvalue, "\n\n")
        
        cat("Ringkasan model:\n")
        print(summary(model$model))
        
        cat("VIF:\n")
        print(vif(model$model))
        cat("\n-------------------------------------------\n\n")
      }
    } else {
      cat("Tidak ditemukan model yang memenuhi kriteria (heteroskedastisitas, VIF < 15, dan AIC < ", aic_threshold, ").\n")
    }
  } else {
    cat("Tidak ditemukan model dengan heteroskedastisitas bahkan dengan VIF < 15.\n")
    
    vif_threshold <- 20
    candidate_models_filtered <- Filter(function(m) m$max_vif < vif_threshold, candidate_models)
    
    if (length(candidate_models_filtered) > 0) {
      sorted_by_bp <- candidate_models_filtered[order(sapply(candidate_models_filtered, function(m) m$bp_pvalue))]
      
      cat("\nAlternatif: Model-models dengan p-value BP test terendah (VIF < 20):\n\n")
      
      for (i in 1:min(3, length(sorted_by_bp))) {
        model <- sorted_by_bp[[i]]
        cat("Model", i, ":\n")
        print(model$formula)
        cat("McFadden R2:", model$mcfadden_r2, "\n")
        cat("AIC:", model$aic, "\n")
        cat("Max VIF:", model$max_vif, "\n")
        cat("BP test p-value:", model$bp_pvalue, "\n\n")
        
        cat("Ringkasan model:\n")
        print(summary(model$model))
        
        cat("VIF:\n")
        print(vif(model$model))
        cat("\n-------------------------------------------\n\n")
      }
    }
  }
}

# Tampilkan pesan penutup
cat("\nModel-models dengan BP test p-value < 0.05 memberikan justifikasi kuat untuk menggunakan GWNBR.")
cat("\nAnda dapat memilih model dengan McFadden R2 tertinggi dan VIF yang masih dapat diterima.")
cat("\nModel dengan minimal 7 variabel prediktor akan memberikan analisis yang lebih komprehensif.") 