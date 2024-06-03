import { Component, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils'
/* tslint:disable */
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-mdo-channels-microsite',
  templateUrl: './mdo-channels-microsite.component.html',
  styleUrls: ['./mdo-channels-microsite.component.scss']
})
export class MdoChannelsMicrositeComponent implements OnInit {
  channnelName = ''
  orgId = ''
  selectedIndex = 0
  sectionList: any = []
  titles = [
    {
      title: `MDO channel`,
      url: `/app/learn/mdo-channels/all-channels`,
      textClass: 'ws-mat-black60-text',
      icon: '', disableTranslate: true,
    },
  ]
  showModal: boolean = false
  descriptionMaxLength = 500
  expanded = false
  isTelemetryRaised: boolean = false

  constructor(
    private route: ActivatedRoute,
    private eventSvc: EventService,
  ) { 
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.channnelName = params['channel']
      this.orgId = params['orgId']
      this.titles.push({
        title: this.channnelName, icon: '', url: 'none', disableTranslate: true,
        textClass: '',
      })
    })
  }

  public tabClicked(tabEvent: MatTabChangeEvent) {
    this.raiseTelemetry(`${tabEvent.tab.textLabel} tab`)
  }
  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData['hideSection'] = true
    }
  }

  triggerOpenDialog(event: boolean) {
    if(event) {
      this.showModal = true
      document.body.style.overflow = 'hidden'
    }
    this.raiseTelemetry('btn open key annoucements')
  }

  onClose() {
    this.showModal = false
    document.body.style.overflow = 'auto'
    this.raiseTelemetry('btn close key annoucements')
  }

  viewMoreOrLess() {
    console.log("expanded ", this.expanded)
    this.expanded = !this.expanded
  }

  raiseTelemetryInteratEvent(event: any) {
    if (event && event.viewMoreUrl) {
      this.raiseTelemetry(`${event.stripTitle} ${event.viewMoreUrl.viewMoreText}`)
    }
    if (!this.isTelemetryRaised) {
      this.eventSvc.raiseInteractTelemetry(
        {
          type: 'click',
          subType: 'mdo-channel',
          id: `${_.kebabCase(event.typeOfTelemetry.toLocaleLowerCase())}-card`,
        },
        {
          id: event.identifier,
          type: event.primaryCategory,
        },
        {
          pageIdExt: `${_.kebabCase(event.primaryCategory.toLocaleLowerCase())}-card`,
          module: WsEvents.EnumTelemetrymodules.LEARN,
        }
      )
      this.isTelemetryRaised = true
    }
  }

  raiseCompetencyTelemetry(name: string) {
    this.raiseTelemetry(`${name} core expertise`)
  }

  raiseTelemetry(name: string) {
    this.eventSvc.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-channel',
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.LEARN,
      }
    )
  }

}
