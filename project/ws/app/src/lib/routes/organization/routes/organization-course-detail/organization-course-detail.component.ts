import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-organization-course-detail',
  templateUrl: './organization-course-detail.component.html',
  styleUrls: ['./organization-course-detail.component.scss'],
})
export class OrganizationCourseDetailComponent implements OnInit {
  coursesDetail: any
  courseId: any
  result: any
  titles = [{ title: 'Register for Inservice Training Program 2023-24', url: '/app/organisation/dopt', icon: '' }]
  constructor(private route: ActivatedRoute) {
    this.coursesDetail = this.route.parent && this.route.parent.snapshot.data.pageData.data.courseDetail || []
  }

  ngOnInit() {
    console.log(this.route.snapshot.params.id, 'route data params=')
    this.courseId = this.route.snapshot.params.id
    console.log(this.courseId)
    // let result = this.coursesDetail.filter((data:any) => data.id === courseId)
     // tslint:disable-next-line: align
    const courseData = this.coursesDetail.filter((data: any) => data.id == this.courseId)
    this.result = courseData[0]
  }

}