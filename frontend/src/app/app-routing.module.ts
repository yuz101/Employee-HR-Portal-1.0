import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VisaManagementHrComponent } from './components/visa-management-hr/visa-management-hr.component';
import { HouseListComponent } from './components/house-list/house-list.component';
import { HouseDetailComponent } from './components/house-detail/house-detail.component';
import { HouseAddComponent } from './components/house-add/house-add.component';
import { EmployeeHouseDetailComponent } from './components/employee-house-detail/employee-house-detail.component';
import { EmployeeProfilesComponent } from './components/employee-profiles/employee-profiles.component';
import { RegistrationEmailsComponent } from './components/registration-emails/registration-emails.component';
import { OnboardingApplicationReviewComponent } from './components/onboarding-application-review/onboarding-application-review.component';
import { WorkAuthorizationManagementEmployeeComponent } from './components/work-authorization-management-employee/work-authorization-management-employee.component';


const routes: Routes = [
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'registration-emails', component: RegistrationEmailsComponent },
  { path: 'onboarding-application-review', component: OnboardingApplicationReviewComponent },
  { path: 'visa-management-hr', component: VisaManagementHrComponent },
  { path: 'housing', component: HouseAddComponent },
  { path: 'houses', component: HouseListComponent },
  { path: 'houses/:id', component: HouseDetailComponent },
  { path: 'employee/housing', component: EmployeeHouseDetailComponent },
  { path: 'profiles', component: EmployeeProfilesComponent },
  { path: 'employees/:id', component: EmployeeProfilesComponent },
  { path: 'work-authorization-management', component: WorkAuthorizationManagementEmployeeComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
