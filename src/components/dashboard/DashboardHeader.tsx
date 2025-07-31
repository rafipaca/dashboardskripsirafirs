import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard GWNBR Pneumonia</h1>
        <p className="text-muted-foreground">
          Visualisasi Model GWNBR untuk Kasus Pneumonia Balita di Pulau Jawa
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Breadcrumbs />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Provinsi</SelectItem>
            <SelectItem value="jawa_barat">Jawa Barat</SelectItem>
            <SelectItem value="jawa_tengah">Jawa Tengah</SelectItem>
            <SelectItem value="jawa_timur">Jawa Timur</SelectItem>
            <SelectItem value="banten">Banten</SelectItem>
            <SelectItem value="dki_jakarta">DKI Jakarta</SelectItem>
            <SelectItem value="di_yogyakarta">DI Yogyakarta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 