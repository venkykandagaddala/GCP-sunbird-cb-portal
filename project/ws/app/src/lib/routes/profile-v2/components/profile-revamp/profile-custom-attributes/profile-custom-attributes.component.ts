import { Component, Input, OnInit } from '@angular/core';
import { ProfileV2RevampService } from '../../../services/profile-v2-revamp.service';
import * as _ from 'lodash';

@Component({
  selector: 'ws-app-profile-custom-attributes',
  templateUrl: './profile-custom-attributes.component.html',
  styleUrls: ['./profile-custom-attributes.component.scss']
})
export class ProfileCustomAttributesComponent implements OnInit {

  @Input() orgId: string = ''
  customAttrList: any[] = []

  constructor(private ProfileV2RevampService: ProfileV2RevampService,) { }

  ngOnInit(): void {
    let payload = {
      filterCriteriaMap: {
        organisationId: this.orgId,
      },
      requestedFields: [],
      pageNumber: 0,
      pageSize: 50,
      orderDirection: "DESC",
      orderBy: 'updatedOn',
      facets: []
    }
    this.ProfileV2RevampService.fetchCustomFields(payload).subscribe((res: any) => {
      this.customAttrList = _.get(res, 'result.searchResults.data', [])
      console.log("this.customAttrList ", this.customAttrList)
    })
  }

}
