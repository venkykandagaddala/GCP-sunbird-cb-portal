import { EventSessionsComponent } from './event-sessions.component';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

describe('EventSessionsComponent', () => {
  let component: EventSessionsComponent;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockEventService: jest.Mocked<EventService>;
  let mockChangeDetectorRef: jest.Mocked<ChangeDetectorRef>;

  beforeEach(() => {
    mockActivatedRoute = {
      parent: {
        data: of({
          eventdata: {
            data: {
              SessionCards: {
                Sessions: {
                  session1: {
                    SessionType: 'Keynote',
                    SessionImage: 'image.jpg',
                    SessionTitle: 'Test Session',
                    SessionStartTime: '2023-01-01T10:00:00',
                    SessionEndTime: '2023-01-01T11:00:00',
                    Speaker: 'John Doe',
                    Attendees: 100
                  }
                }
              }
            }
          }
        })
      }
    } as any;

    mockEventService = {
      bannerisEnabled: {
        next: jest.fn()
      }
    } as any;

    mockChangeDetectorRef = {
      detectChanges: jest.fn()
    } as any;

    component = new EventSessionsComponent(
      mockActivatedRoute,
      mockEventService,
      mockChangeDetectorRef
    );

    // Mock Date.parse to return consistent values
    global.Date.parse = jest.fn(() => new Date('2023-01-01T09:00:00').getTime());
  });

  afterEach(() => {
    if (component.currentSubscription) {
      component.currentSubscription.unsubscribe();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should enable banner on init', () => {
    component.ngOnInit();
    expect(mockEventService.bannerisEnabled.next).toHaveBeenCalledWith(true);
  });

  it('should populate data correctly from route', () => {
    component.ngOnInit();
    expect(component.data.length).toBe(1);
    expect(component.data[0].sessionID).toBe('Session1');
    expect(component.data[0].speakerType).toBe('Keynote');
    expect(component.data[0].speakerName).toBe('John Doe');
  });

  it('should calculate session times correctly', () => {
    component.ngOnInit();
    expect(component.sessionStartTime.length).toBe(1);
    expect(component.sessionEndTime.length).toBe(1);
    
    // Check time calculations
    const expectedStartTime = Date.parse('2023-01-01T10:00:00') - Date.parse('2023-01-01T09:00:00');
    const expectedEndTime = Date.parse('2023-01-01T11:00:00') - Date.parse('2023-01-01T09:00:00');
    
    expect(component.sessionStartTime[0]).toBe(expectedStartTime);
    expect(component.sessionEndTime[0]).toBe(expectedEndTime);
  });

  it('should update live speakers periodically', () => {
    jest.useFakeTimers();
    
    component.ngOnInit();
    
    // Simulate time passing
    jest.advanceTimersByTime(60000);
    
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
    
    jest.useRealTimers();
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    const unsubscribeSpy = jest.spyOn(component.currentSubscription!, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle empty sessions gracefully', () => {
    mockActivatedRoute.parent!.data = of({
      eventdata: {
        data: {
          SessionCards: {
            Sessions: {} // Empty sessions
          }
        }
      }
    });
  
    component.ngOnInit();
  
    expect(component.data.length).toBe(0); // Should be 0
    expect(component.sessionStartTime.length).toBe(0); // Should be 0
    expect(component.sessionEndTime.length).toBe(0); // Should be 0
  });
});