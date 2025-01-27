import { WsEvents } from "@sunbird-cb/utils-v2";
import { FeedListComponent } from "./feed-list.component";

describe('FeedListComponent', () => {
  let component: FeedListComponent;
  let mockActivatedRoute: { snapshot: { data: { pageData?: { data: any } } } };
  let mockEventService: { raiseInteractTelemetry: jasmine.Spy };
  let mockUtilityService: { isMobile: boolean };

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        data: {
          pageData: {
            data: [{ id: 1, title: 'Test Content' }]
          }
        }
      }
    };

    mockEventService = {
      raiseInteractTelemetry: jasmine.createSpy('raiseInteractTelemetry')
    };

    mockUtilityService = {
      isMobile: true
    };

    component = new FeedListComponent(
      mockActivatedRoute as any,
      mockEventService as any,
      mockUtilityService as any
    );
  });

  it('should initialize contentStripData from route data', () => {
    component.ngOnInit();
    expect(component.contentStripData).toEqual([{ id: 1, title: 'Test Content' }]);
  });

  it('should set isMobile from utility service', () => {
    component.ngOnInit();
    expect(component.isMobile).toBe(true);
  });

  it('should raise telemetry for external content', () => {
    const externalEvent = {
      contentId: 'test-ext-content',
      typeOfTelemetry: 'external'
    };

    component.raiseTelemetryInteratEvent(externalEvent);

    expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'providers',
        id: 'card-content',
      },
      {
        id: 'event.contentId',
        type: 'External content'
      },
      {
        module: WsEvents.EnumTelemetrymodules.HOME
      }
    );
  });

  it('should raise telemetry for MDO channel', () => {
    const mdoEvent = {
      typeOfTelemetry: 'mdo-channel',
      identifier: 'channel-id',
      orgName: 'Test Organization'
    };

    component.raiseTelemetryInteratEvent(mdoEvent);

    expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'mdo-channel',
        id: 'content-card',
      },
      {
        id: 'channel-id',
        type: 'Test Organization'
      },
      {
        module: WsEvents.EnumTelemetrymodules.HOME
      }
    );
  });

  it('should raise telemetry for CBP plan', () => {
    const cbpEvent = {
      typeOfTelemetry: 'cbpPlan',
      identifier: 'plan-id',
      primaryCategory: 'Learning Plan',
      selectedTab: 'active',
      selectedPill: 'ongoing'
    };

    component.raiseTelemetryInteratEvent(cbpEvent);

    expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'active-ongoing',
        id: 'content-card',
      },
      {
        id: 'plan-id',
        type: 'Learning Plan'
      },
      {
        module: WsEvents.EnumTelemetrymodules.HOME
      }
    );
  });

  it('should raise telemetry for view more event', () => {
    const viewMoreEvent = {
      stripTitle: 'Test Strip',
      viewMoreUrl: { viewMoreText: 'View More' },
      typeOfTelemetry: 'view-more'
    };

    component.raiseTelemetryInteratEvent(viewMoreEvent);

    expect(mockEventService.raiseInteractTelemetry).toHaveBeenCalledWith(
      {
        type: 'click',
        subType: 'view-more',
        id: 'test-strip-view-more',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME
      }
    );
  });
});