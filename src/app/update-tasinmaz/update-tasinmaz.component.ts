import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ";
import { defaults as defaultControls, ScaleLine } from "ol/control";

@Component({
  selector: "app-update-tasinmaz",
  templateUrl: "./update-tasinmaz.component.html",
  styleUrls: ["./update-tasinmaz.component.css"],
})
export class UpdateTasinmazComponent implements OnInit {
  tasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  tasinmazId: number;
  map: Map | undefined;
  errorMessage: string = "";
  showError: boolean = false;
  showSuccess: boolean = false;
  osmLayer: TileLayer<OSM>;
  googleLayer: TileLayer<XYZ>;
  osmOpacity: number = 1;
  googleOpacity: number = 1;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.osmLayer = new TileLayer({
      source: new OSM(),
      visible: true,
      opacity: 1,
    });

    this.googleLayer = new TileLayer({
      source: new XYZ({
        url: "http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
      }),
      visible: false,
      opacity: 1,
    });
  }

  ngOnInit(): void {
    this.tasinmazId = Number(this.route.snapshot.paramMap.get("id"));
    if (!this.tasinmazId) {
      console.error("Taşınmaz ID alınamadı!");
      return;
    }

    this.tasinmazForm = this.fb.group({
      ilId: [0, Validators.required],
      ilceId: [0, Validators.required],
      mahalleId: [0, Validators.required],
      ada: ["", Validators.required],
      parsel: ["", Validators.required],
      koordinat: ["", Validators.required],
      nitelik: ["", Validators.required],
      adres: ["", Validators.required],
    });

    this.apiService.getTasinmazById(this.tasinmazId).subscribe({
      next: (data) => {
        console.log("Gelen veri:", data);
        console.log("tasinmaz id:", data.id);

        this.tasinmazForm.patchValue({
          ilId: data.mahalle.ilce.il.id || 0,
          ilceId: data.mahalle.ilce.id || 0,
          mahalleId: data.mahalle.id || 0,
          ada: data.ada || "",
          parsel: data.parsel || "",
          koordinat: data.koordinat || "",
          nitelik: data.nitelik || "",
          adres: data.adres || "",
        });

        this.ilceler = [data.mahalle.ilce];
        this.mahalleler = [data.mahalle];

        this.loadIller();
      },
      error: (err) => console.error("Taşınmaz yüklenemedi:", err),
    });
    this.map = new Map({
      target: "map",
      layers: [this.osmLayer, this.googleLayer],
      view: new View({
        center: fromLonLat([32.8597, 39.9334]),
        zoom: 6,
      }),
      controls: defaultControls().extend([new ScaleLine()]),
    });

    this.map.on("click", (event) => {
      const coordinates = toLonLat(event.coordinate);
      console.log("Tıklanan Koordinatlar:", coordinates);

      // Koordinatları form alanına yerleştir
      this.tasinmazForm.patchValue({
        koordinat: `${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`,
      });
    });
  }

  loadIller(): void {
    this.apiService.getIller().subscribe({
      next: (iller) => {
        this.iller = iller;
        // console.log('İller Yüklendi:', this.iller);
        // console.log('İller:', this.iller);
        // console.log('Seçili İl ID:', this.tasinmazForm.get('ilId').value);

        const selectedIlId = this.tasinmazForm.get("mahalle.ilce.il.id").value;
        if (selectedIlId) {
          const selectedIl = this.iller.find((il) => il.id === selectedIlId);
          console.log("Seçilen İl:", selectedIl);
          console.log("Seçili İl:", selectedIl);
          if (selectedIl) {
            this.tasinmazForm.get("mahalle.ilce.il.id").setValue(selectedIl.id);
          }
        }
      },
      error: (err) => console.error("İller yüklenemedi:", err),
    });
  }

  onIlChange(event: Event): void {
    const ilId = parseInt((event.target as HTMLSelectElement).value, 10);
    console.log("İl ID Tipi:", typeof ilId, "Değer:", ilId);
    this.tasinmazForm.patchValue({
      //secince ilce mahalle sifirlama
      ilceId: 0,
      mahalleId: 0,
    });

    this.ilceler = []; //secince ilce mahalle sifirlama
    this.mahalleler = [];
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
    if (this.tasinmazForm.valid) {
      const updatedTasinmaz = {
        ...this.tasinmazForm.value,
        id: this.tasinmazId,
        ilId: Number(this.tasinmazForm.value.ilId),
        ilceId: Number(this.tasinmazForm.value.ilceId),
        mahalleId: Number(this.tasinmazForm.value.mahalleId),
      };
      console.log("Güncelleme için gönderilen veri:", updatedTasinmaz);

      this.apiService.updateTasinmaz(updatedTasinmaz).subscribe({
        next: () => {
          console.log("Taşınmaz başarıyla güncellendi!"),
            (this.showSuccess = true);
          this.showError = false;
          setTimeout(() => {
            this.router.navigate(["/tasinmaz"]);
          }, 3000);
          // alert("tasinmaz başariyla guncellendi");
          //  this.router.navigate(["/tasinmaz"]);
        },
        error: (err) => {
          this.showError = true;
          this.errorMessage =
            "Formu doldururken bir hata oluştu. Lütfen tekrar deneyin.";
          console.error("Hata:", err);
        },
        // error: (err) => console.error("Güncelleme hatası:", err),
      });
    } else {
      console.error("Form geçersiz");
    }
  }
  cancel() {
    this.router.navigate(["/"]);
  }
  onOsmOpacityChange(event: any): void {
    this.osmOpacity = parseFloat(event.target.value);
    this.osmLayer.setOpacity(this.osmOpacity);
  }

  onGoogleOpacityChange(event: any): void {
    this.googleOpacity = parseFloat(event.target.value);
    this.googleLayer.setOpacity(this.googleOpacity);
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
  toggleOsmLayer(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
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
}
