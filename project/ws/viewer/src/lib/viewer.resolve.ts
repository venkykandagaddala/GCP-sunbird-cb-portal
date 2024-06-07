import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
// import { AccessControlService } from '@ws/author'
import { WidgetContentService, NsContent, VIEWER_ROUTE_FROM_MIME } from '@sunbird-cb/collection'
import { IResolveResponse, AuthMicrosoftService, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ViewerDataService } from './viewer-data.service'
import { MobileAppsService } from '../../../../../src/app/services/mobile-apps.service'
import { Platform } from '@angular/cdk/platform'
const ADDITIONAL_FIELDS_IN_CONTENT = ['creatorContacts', 'source', 'exclusiveContent']
@Injectable()
export class ViewerResolve
  implements
  Resolve<
  Observable<IResolveResponse<NsContent.IContent>> | IResolveResponse<NsContent.IContent> | null
  > {
  constructor(
    private contentSvc: WidgetContentService,
    private viewerDataSvc: ViewerDataService,
    private mobileAppsSvc: MobileAppsService,
    private router: Router,
    // private accessControlSvc: AccessControlService,
    private msAuthSvc: AuthMicrosoftService,
    private configSvc: ConfigurationsService,
    private platform: Platform,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IResolveResponse<NsContent.IContent>> | null {
    const resourceType = route.data.resourceType
    this.viewerDataSvc.reset(
      route.paramMap.get('resourceId') || route.queryParamMap.get('resourceId'),
      'none',
      route.queryParams['primaryCategory'],
      route.queryParams['collectionId']
    )
    if (!this.viewerDataSvc.resourceId) {
      return null
    }
    // if (
    //   route.queryParamMap.get('preview') === 'true' &&
    //   !this.accessControlSvc.authoringConfig.newDesign &&
    //   resourceType !== 'quiz'
    // ) {
    //   return null
    // }

    const forPreview = window.location.href.includes('/preview/') || route.queryParamMap.get('preview') === 'true'
    return (forPreview
      // ? this.contentSvc.fetchAuthoringContent(this.viewerDataSvc.resourceId)
      ? this.contentSvc.fetchContent(
        this.viewerDataSvc.resourceId,
        'detail',
        ADDITIONAL_FIELDS_IN_CONTENT,
        this.viewerDataSvc.primaryCategory,
      )
      : this.contentSvc.fetchContent(
        this.viewerDataSvc.resourceId,
        'detail',
        ADDITIONAL_FIELDS_IN_CONTENT,
        this.viewerDataSvc.primaryCategory,
      )
    ).pipe(
      tap((content: any) => {
        // tslint:disable-next-line: no-parameter-reassignment
        content = content.result.content
        if (content.status === 'Deleted' || content.status === 'Expired') {
          this.router.navigate([
            `${forPreview ? '/author' : '/app'}/toc/${content.identifier}/overview?primaryCategory=${content.primaryCategory}`,
          ])
        }
        if (content.ssoEnabled) {
          this.msAuthSvc.loginForSSOEnabledEmbed(
            (this.configSvc.userProfile && this.configSvc.userProfile.email) || '',
          )
        }

        if (resourceType === 'unknown') {
          this.router.navigate([ // app/toc/do_113477192567939072124/overview?
            `${forPreview ? '/author' : ''}/app/toc/${content.identifier}/overview`,
          ])
        } else if (resourceType === VIEWER_ROUTE_FROM_MIME(content.mimeType)) {
          this.viewerDataSvc.updateResource(content, null)
        } else {
          this.viewerDataSvc.updateResource(null, {
            errorType: 'mimeTypeMismatch',
            mimeType: content.mimeType,
            probableUrl: `${forPreview ? '/author' : ''}/viewer/${VIEWER_ROUTE_FROM_MIME(
              content.mimeType,
            )}/${content.identifier}`,
          })
        }
      }),
      map((data: any) => {
        // tslint:disable-next-line: no-parameter-reassignment
        data = data.result.content
        if (resourceType === 'unknown') {
          this.router.navigate([
            `${forPreview ? '/author' : ''}/viewer/${VIEWER_ROUTE_FROM_MIME(data.mimeType)}/${data.identifier
            }`,
          ])
        } else if (resourceType === VIEWER_ROUTE_FROM_MIME(data.mimeType)) {
          data.platform = this.platform
          this.mobileAppsSvc.sendViewerData(data)
          return { data, error: null }
        }
        return { data: null, error: 'mimeTypeMismatch' }
      }),
      catchError(error => {
        this.viewerDataSvc.updateResource(null, error)
        return of({ error, data: null })
      }),
    )
  }
}
