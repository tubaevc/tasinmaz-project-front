import { Component, OnInit } from "@angular/core";
import { Log } from "src/models/logModel";
import { AuthService } from "../services/auth.service";
import { LogService } from "../services/log.service";
import { ExcelexportService } from "../services/excelexport.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-log",
  templateUrl: "./log.component.html",
  styleUrls: ["./log.component.css"],
})
export class LogComponent implements OnInit {
  logs: Log[] = [];
  filteredLogs: Log[] = [];
  searchTerm: string = "";

  constructor(
    private authService: AuthService,
    private logService: LogService,
    private router: Router,
    private excelExportService: ExcelexportService
  ) {}

  ngOnInit() {
    this.getLogs();
  }
  getLogs() {
    this.logService.getLogs().subscribe(
      (data: Log[]) => {
        this.logs = data;
        this.filteredLogs = data;
        console.log(data);
      },
      (error) => {
        console.error("Logları alırken bir hata oluştu:", error);
      }
    );
  }

  exportToExcel(): void {
    console.log(this.logs);
    // console.log("logs:", this.data);

    const exportData = this.logs.map((t) => ({
      UserId: t.userId,
      Durum: t.durum,
      İslemTipi: new Date(t.zaman).toLocaleString(),
      Aciklama: t.aciklama,
      Zaman: t.zaman,
      UserIp: t.userIp,
    }));
    console.log("Export Data:", exportData);
    this.excelExportService.exportAsExcelFile(exportData, "Logs");
  }
  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredLogs = this.logs;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();

    this.filteredLogs = this.logs.filter((log) => {
      return (
        log.islemTipi.toLowerCase().includes(searchTermLower) ||
        log.aciklama.toLowerCase().includes(searchTermLower) ||
        new Date(log.zaman)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTermLower) ||
        log.durum.toString().toLowerCase().includes(searchTermLower)
      );
    });
  }

  clearFilter() {
    this.searchTerm = "";
    this.filteredLogs = this.logs;
  }
  isLoggedIn() {
    return this.authService.loggedIn();
  }
  logOut() {
    this.authService.logOut();
    this.router.navigate(["login"]);
  }
}
