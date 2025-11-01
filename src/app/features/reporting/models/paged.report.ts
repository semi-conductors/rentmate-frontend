import { ReportResponse } from "./report.response";

export interface PagedReportsResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  items: ReportResponse[];
}