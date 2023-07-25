import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { Subscription } from 'rxjs'
import { IWidgetsPlayerOfflineSessionData } from './player-offline-session.model'

@Component({
  selector: 'ws-widget-player-offline-session',
  templateUrl: './player-offline-session.component.html',
  styleUrls: ['./player-offline-session.component.scss'],
})
export class PlayerOfflineSessionComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any>, AfterViewInit, OnDestroy {
  @Input() widgetData!: IWidgetsPlayerOfflineSessionData
  viewerDataServiceSubscription: Subscription | null = null
  identifier: string | null = null
  content: any
  enableTelemetry = false

  constructor() {
    super()
  }

  ngOnInit() {
    // TODO:When player is fully implemented put initial functions here
  }

  ngAfterViewInit() {
    if (this.widgetData.content) {
      this.content = this.widgetData.content
    }
  }

  ngOnDestroy() {
    if (this.identifier) {
      // TODO: When player is fully implemeted fire progress and save learning on player close

      // this.saveContinueLearning(this.identifier)
      // this.fireRealTimeProgress(this.identifier)
    }
  }
}
