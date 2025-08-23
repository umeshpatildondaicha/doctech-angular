import { TestBed } from '@angular/core/testing';

import { CustomEventsService } from './custom-events.service';

describe('CustomEventsService', () => {
  let service: CustomEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
