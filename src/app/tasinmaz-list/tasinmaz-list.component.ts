import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Tasinmaz } from "../../models/tasinmaz-model";
import { Router } from "@angular/router";
import { AccountService } from "../services/account.service";
import { AuthService } from "../services/auth.service";
import { ExcelexportService } from "../services/excelexport.service";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import ScaleLine from "ol/control/ScaleLine";
import { defaults as defaultControls } from "ol/control";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
@Component({
  selector: "tasinmaz-list",
  templateUrl: "./tasinmaz-list.component.html",
  styleUrls: ["./tasinmaz-list.component.css"],
})
export class TasinmazList implements OnInit {
  tasinmazlar: (Tasinmaz & { selected: boolean })[] = [];
  allSelected: boolean = false;
  filteredTasinmazlar: (Tasinmaz & { selected: boolean })[] = [];
  searchTerm: string = "";
  map: Map | undefined;
  vectorLayer: VectorLayer;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private excelExportService: ExcelexportService
  ) {
    //for markers
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png", // Marker ikonu
        }),
      }),
    });
  }
  isLoggedIn() {
    return this.authService.loggedIn();
  }
  logOut() {
    this.authService.logOut();
    this.router.navigate(["login"]);
  }

  ngOnInit(): void {
    this.loadTasinmazlar();
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer, // Marker katmanını ekle
      ],
      view: new View({
        center: fromLonLat([32.8597, 39.9334]), // Türkiye'nin koordinatları
        zoom: 5,
      }),
    });
  }
  loadTasinmazlar(): void {
    if (this.authService.isAdmin()) {
      this.apiService.getAllTasinmaz().subscribe((data: Tasinmaz[]) => {
        this.tasinmazlar = data.map((item) => ({ ...item, selected: false }));
        this.filteredTasinmazlar = [...this.tasinmazlar];
        console.log("Filtered Tasinmazlar:", this.filteredTasinmazlar);

        this.addMarkersToMap(); // İlk olarak tüm listeyi göster
      });
    } else {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.apiService.getTasinmazlarByUser(userId).subscribe({
          next: (data: Tasinmaz[]) => {
            this.tasinmazlar = data.map((item) => ({
              ...item,
              selected: false,
            }));
            this.filteredTasinmazlar = [...this.tasinmazlar];
            console.log("Filtered Tasinmazlar:", this.filteredTasinmazlar);

            this.addMarkersToMap();
            // Kullanıcı verilerini filtreleme için hazırla
          },
          error: (error) => {
            console.error("Veri çekme hatası:", error);
          },
        });
      }
    }
  }
  // loadTasinmazlar(): void {
  //   if (this.authService.isAdmin()) {
  //     this.apiService.getAllTasinmaz().subscribe({
  //       next: (data: Tasinmaz[]) => {
  //         this.tasinmazlar = data.map((item) => ({
  //           ...item,
  //           selected: false,
  //         }));
  //         console.log(this.tasinmazlar);
  //       },
  //       error: (error) => {
  //         console.error("Veri çekme hatası:", error);
  //       },
  //     });
  //   } else {
  //     const userId = this.authService.getCurrentUserId();
  //     if (userId) {
  //       this.apiService.getTasinmazlarByUser(userId).subscribe({
  //         next: (data: Tasinmaz[]) => {
  //           this.tasinmazlar = data.map((item) => ({
  //             ...item,
  //             selected: false,
  //           }));
  //           console.log(this.tasinmazlar);
  //         },
  //         error: (error) => {
  //           console.error("Veri çekme hatası:", error);
  //         },
  //       });
  //     }
  //   }
  // }
  exportToExcel(): void {
    console.log("tasinmazlar:", this.tasinmazlar);

    const exportData = this.tasinmazlar.map((t) => ({
      UserId: t.userId,
      Il: t.mahalle.ilce.il.ilAdi || "Veri Yok",
      Ilce: t.mahalle.ilce.ilceAdi || "Veri Yok",
      Mahalle: t.mahalle.mahalleAdi || "Veri Yok",
      Ada: t.ada,
      Parsel: t.parsel,
      Koordinat: t.koordinat,
      Nitelik: t.nitelik,
      Adres: t.adres,
    }));
    console.log("Export Data:", exportData);
    this.excelExportService.exportAsExcelFile(exportData, "Tasinmazlar");
  }
  deleteSelected(): void {
    const selectedIds = this.tasinmazlar
      .filter((t) => t.selected)
      .map((t) => t.id);

    if (selectedIds.length === 0) {
      alert("Silinecek taşınmaz seçilmedi!");
      return;
    }

    if (confirm("Seçili taşınmazları silmek istediğinizden emin misiniz?")) {
      this.apiService.deleteMultipleTasinmaz(selectedIds).subscribe({
        next: () => {
          this.tasinmazlar = this.tasinmazlar.filter(
            (t) => !selectedIds.includes(t.id)
          );
          this.loadTasinmazlar();
        },
        error: (err) => {
          //console.error("Silme işlemi hatası:", err);
          console.log("Error Response:", err.error);
          //console.log("HTTP Status Code:", err.status);
        },
      });
    }
  }
  anySelected(): boolean {
    return this.tasinmazlar.some((t) => t.selected);
  }

  onEditSelected(): void {
    const selectedTasinmaz = this.tasinmazlar.find((t) => t.selected);

    if (!selectedTasinmaz) {
      alert(" tasinmaz secilmedi");
      return;
    }

    //console.log("Güncellenecek Taşınmaz ID:", selectedTasinmaz.id);
    this.router.navigate([`/update-tasinmaz/${selectedTasinmaz.id}`]);
  }
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tasinmazlar.forEach((t) => (t.selected = checked));
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    this.allSelected = this.tasinmazlar.every((t) => t.selected);
  }
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();

    if (!term) {
      // Eğer arama terimi boşsa, orijinal listeyi göster
      this.filteredTasinmazlar = [...this.tasinmazlar];
    } else {
      // Filtreleme işlemini uygula
      this.filteredTasinmazlar = this.tasinmazlar.filter((tasinmaz) =>
        Object.values({
          userId: tasinmaz.userId,
          il: tasinmaz.mahalle.ilce.il.ilAdi || "",
          ilce: tasinmaz.mahalle.ilce.ilceAdi || "",
          mahalle: tasinmaz.mahalle.mahalleAdi || "",
          ada: tasinmaz.ada,
          parsel: tasinmaz.parsel,
          koordinat: tasinmaz.koordinat,
          nitelik: tasinmaz.nitelik,
          adres: tasinmaz.adres,
        })
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
  }
  clearFilter(): void {
    this.searchTerm = ""; // Arama terimini sıfırla
    this.filteredTasinmazlar = [...this.tasinmazlar]; // Orijinal listeyi göster
  }
  // string koordinati int alma
  private parseCoordinates(coordinateString: string | null): [number, number] {
    if (!coordinateString || !coordinateString.includes(",")) {
      console.warn("gecersiz koordinat:", coordinateString);
      return [0, 0];
    }

    const [lon, lat] = coordinateString
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    if (isNaN(lon) || isNaN(lat)) {
      console.warn("koordinat sayiya donusturulemedi:", coordinateString);
      return [0, 0];
    }

    return [lon, lat];
  }

  addMarkersToMap(): void {
    const source = this.vectorLayer.getSource();

    if (!source) return;

    source.clear();

    this.filteredTasinmazlar.forEach((tasinmaz) => {
      const coordinates = this.parseCoordinates(tasinmaz.koordinat);
      if (!tasinmaz.koordinat || coordinates[0] === 0) {
        console.warn("Geçersiz koordinat atlandı:", tasinmaz.koordinat);
        return;
      }

      const [lon, lat] = this.parseCoordinates(tasinmaz.koordinat);

      const marker = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
      });

      source.addFeature(marker);
    });

    console.log("markerlar eklendi");
  }
}
