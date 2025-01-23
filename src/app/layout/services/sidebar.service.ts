import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isPinnedSubject = new BehaviorSubject<boolean>(false);
  isPinned$ = this.isPinnedSubject.asObservable();

  private isHoveredSubject = new BehaviorSubject<boolean>(false);
  isHovered$ = this.isHoveredSubject.asObservable();

  setPinnedState(isPinned: boolean) {
    this.isPinnedSubject.next(isPinned);
  }

  setHoverState(isHovered: boolean) {
    this.isHoveredSubject.next(isHovered);
  }
}
