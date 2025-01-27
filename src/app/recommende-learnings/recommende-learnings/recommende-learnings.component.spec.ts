import { RecommendeLearningsComponent } from './recommende-learnings.component';
import { of } from 'rxjs';

describe('RecommendeLearningsComponent', () => {
  let component: RecommendeLearningsComponent;
  let mockActivatedRoute: any;
  let mockWidgetSvc: any;
  let mockTranslate: any;
  let mockLangTranslations: any;
  let mockSeeAllSvc: any;
  let mockEnrollSvc: any;

  beforeEach(() => {
    // Create mock dependencies
    mockActivatedRoute = {
      queryParams: of({ pillSelected: 'testPill' }),
      snapshot: {
        data: {
          pageData: {
            data: {
              recommendedConfig: {
                strip: {
                  request: { designationsList: { path: 'testPath' } },
                  viewMoreUrl: { stripConfig: {} }
                }
              }
            }
          }
        }
      }
    };

    mockWidgetSvc = {
      getData: jest.fn().mockReturnValue(of([]))
    };

    mockTranslate = {
      setDefaultLang: jest.fn(),
      use: jest.fn()
    };

    mockLangTranslations = {
      languageSelectedObservable: of(null),
      translateLabel: jest.fn().mockReturnValue('translated')
    };

    mockSeeAllSvc = {
      fetchDesigantionsData: jest.fn().mockReturnValue(of(['course1', 'course2'])),
      fetchSearchData: jest.fn().mockReturnValue(of({
        result: {
          content: [
            { identifier: 'course1', name: 'Course 1' },
            { identifier: 'course2', name: 'Course 2' }
          ]
        }
      }))
    };

    mockEnrollSvc = {
      fetchEnrollContentData: jest.fn().mockResolvedValue({
        result: {
          courses: [
            { contentId: 'course1', status: 1 },
            { contentId: 'course2', status: 2 }
          ]
        }
      })
    };

    // Mock localStorage
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('en');

    // Create component
    component = new RecommendeLearningsComponent(
      mockActivatedRoute,
      mockWidgetSvc,
      mockTranslate,
      mockLangTranslations,
      mockSeeAllSvc,
      mockEnrollSvc
    );
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected pill from query params', () => {
    component.ngOnInit();
    expect(component.slectedPill).toBe('testPill');
  });

  it('should set recommended config', () => {
    component.ngOnInit();
    expect(component.recommendedConfig).toBeDefined();
  });

  it('should filter courses by status', async () => {
    await component.ngOnInit();
    await component.getRecommendeLeanings();

    expect(component.results.length).toBe(3);
    const availableCourses = component.results.find((r: any) => r.name === 'ravailable');
    const inProgressCourses = component.results.find((r: any) => r.name === 'rinprogress');
    const completedCourses = component.results.find((r: any) => r.name === 'rcompleted');

    expect(availableCourses).toBeTruthy();
    expect(inProgressCourses).toBeTruthy();
    expect(completedCourses).toBeTruthy();
  });

  it('should update content when pill clicked', () => {
    component.results = [
      { name: 'testPill', courses: [{ id: 1 }, { id: 2 }] }
    ];
    component.pillClicked({ value: 'testPill' });
    
    expect(component.slectedPill).toBe('testPill');
    expect(component.content).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should translate labels', () => {
    const translatedLabel = component.translateLabels('test', 'type');
    expect(mockLangTranslations.translateLabel).toHaveBeenCalledWith('test', 'type', '');
    expect(translatedLabel).toBe('translated');
  });
});