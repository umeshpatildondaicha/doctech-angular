import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Column {
  name: string;
  type: 'text' | 'number' | 'date';
  key: string;
  visible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TableConfigService {
  private tableData = new BehaviorSubject<any[]>([]);
  private tableColumns = new BehaviorSubject<Column[]>([]);

  constructor() { }

  setTableData(data: any[]) {
    this.tableData.next(data);
  }

  getTableData() {
    return this.tableData.asObservable();
  }

  setTableColumns(columns: Column[]) {
    this.tableColumns.next(columns);
  }

  getTableColumns() {
    return this.tableColumns.asObservable();
  }
}
