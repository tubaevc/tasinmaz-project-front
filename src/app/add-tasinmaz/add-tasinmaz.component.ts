import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../services/api.service";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { fromLonLat, toLonLat } from "ol/proj";
import ScaleLine from "ol/control/ScaleLine";
import { defaults as defaultControls } from "ol/control";
@Component({
  selector: "app-add-tasinmaz",
  templateUrl: "./add-tasinmaz.component.html",
  styleUrls: ["./add-tasinmaz.component.css"],
})
export class AddTasinmazComponent implements OnInit {
  tasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  map: Map | undefined;
  osmLayer: TileLayer<OSM>;
  googleLayer: TileLayer<XYZ>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.osmLayer = new TileLayer({
      source: new OSM(),
      visible: true, // Başlangıçta açık
      opacity: 1, // Opaklık: 1 (tamamen görünür)
    });

    // Google Maps Katmanı (XYZ kaynağı ile)
    this.googleLayer = new TileLayer({
      source: new XYZ({
        url: "http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
      }),
      visible: false, // Başlangıçta kapalı
      opacity: 1, // Opaklık: 1 (tamamen görünür)
    });
  }

  ngOnInit(): void {
    // console.log(this.authService.isAdmin());
    this.createForm();
    this.loadIller();
    const scaleControl = new ScaleLine({
      units: "metric",
      bar: true,
      steps: 4,
      text: true,
      minWidth: 100,
      target: document.createElement("div"), // Özel bir hedef element oluştur
    });
    //map
    this.map = new Map({
      target: "map",
      layers: [
        this.osmLayer, // OpenStreetMap layer
        this.googleLayer, // Google Maps layer
      ],
      view: new View({
        center: fromLonLat([32.8597, 39.9334]), // Türkiye'nin koordinatları
        zoom: 5,
      }),
      controls: defaultControls().extend([scaleControl]), // Ölçek çizgisi kontrolünü ekle
    });
    this.map.on("click", (event) => {
      const coordinates = toLonLat(event.coordinate); // Koordinatları LonLat formatına çevir
      console.log("Tıklanan Koordinatlar:", coordinates);

      // Koordinatları form alanına yerleştir
      this.tasinmazForm.patchValue({
        koordinat: `${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`, // 6 basamaklı hassasiyet
      });
    });
    this.map.once("postrender", () => {
      this.map.updateSize();
    });
  }

  private createForm(): void {
    const userId = this.getUserIdFromToken();
    this.tasinmazForm = this.fb.group({
      ilId: [0, Validators.required],
      ilceId: [0, Validators.required],
      mahalleId: [0, Validators.required],
      ada: ["", Validators.required],
      parsel: ["", Validators.required],
      koordinat: ["", Validators.required],
      nitelik: ["", Validators.required],
      adres: ["", Validators.required],
      userId: [userId, Validators.required],
    });
  }

  private loadIller(): void {
    this.apiService.getIller().subscribe({
      next: (data) => (this.iller = data),
      error: (err) => console.error("İller yüklenemedi:", err),
    });
  }

  onIlChange(event: Event): void {
    const ilId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("İl ID Tipi:", typeof ilId, "Değer:", ilId);
    this.apiService.getIlceler(ilId).subscribe({
      next: (data) => (this.ilceler = data),
      error: (err) => console.error("İlçeler yüklenemedi:", err),
    });
  }

  onIlceChange(event: Event): void {
    const ilceId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("İlçe ID Tipi:", typeof ilceId, "Değer:", ilceId);
    this.apiService.getMahalleler(ilceId).subscribe({
      next: (data) => (this.mahalleler = data),
      error: (err) => console.error("Mahalleler yüklenemedi:", err),
    });
  }
  onMahalleChange(event: Event): void {
    const mahalleId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("Mahalle ID Tipi:", typeof mahalleId, "Değer:", mahalleId);
  }

  onSubmit(): void {
    const userId = this.getUserIdFromToken();
    if (this.tasinmazForm.valid) {
      const tasinmazData = {
        ...this.tasinmazForm.value,
        ilId: parseInt(this.tasinmazForm.value.ilId, 10),
        ilceId: parseInt(this.tasinmazForm.value.ilceId, 10),
        mahalleId: parseInt(this.tasinmazForm.value.mahalleId, 10),
        userId: userId,
      };

      console.log("Gönderilen Veri:", tasinmazData);

      this.apiService.addTasinmaz(tasinmazData).subscribe({
        next: (response) => {
          console.log("Taşınmaz başarıyla eklendi:", response),
            alert("tasinmaz eklendi:");
          this.router.navigate(["/tasinmaz"]);
        },
        error: (err) => console.error("Hata:", err),
      });
    } else {
      console.error("Form geçersiz");
    }
  }
  private getUserIdFromToken(): number {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token bulunamadı.");
      return 0;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Geçersiz JWT formatı:", token);
        return 0;
      }

      const payload = JSON.parse(atob(parts[1])); // Payload kısmını çözümle
      console.log("Çözümlenen Payload:", payload);
      if (payload && payload.nameid) {
        return parseInt(payload.nameid, 10);
      }
      return 0;
    } catch (error) {
      console.error("Token çözümleme hatası:", error);
      return 0;
    }
  }
  toggleOsmLayer(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      // OpenStreetMap açılırken Google Maps'i kapat
      this.osmLayer.setVisible(true);
      this.googleLayer.setVisible(false);
      // Google Maps checkbox'ını uncheck yap
      const googleCheckbox = document.getElementById(
        "google-layer"
      ) as HTMLInputElement;
      if (googleCheckbox) {
        googleCheckbox.checked = false;
      }
    } else {
      this.osmLayer.setVisible(false);
    }
  }

  toggleGoogleLayer(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Google Maps açılırken OpenStreetMap'i kapat
      this.googleLayer.setVisible(true);
      this.osmLayer.setVisible(false);
      // OpenStreetMap checkbox'ını uncheck yap
      const osmCheckbox = document.getElementById(
        "osm-layer"
      ) as HTMLInputElement;
      if (osmCheckbox) {
        osmCheckbox.checked = false;
      }
    } else {
      this.googleLayer.setVisible(false);
    }
  }

  setOsmOpacity(opacity: string): void {
    if (this.osmLayer) {
      this.osmLayer.setOpacity(parseFloat(opacity));
    }
  }
  setGoogleOpacity(opacity: string): void {
    if (this.googleLayer) {
      this.googleLayer.setOpacity(parseFloat(opacity));
    }
  }
}
