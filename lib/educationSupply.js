'use strict';
/**
 * Write your transction processor functions here
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Create new product listing contrat for the list of prodcuts
 * @param {composer.education.supply.createStudentListing} createStudentListing
 * @transaction
 */
function createStudentListing(listing) {
    if(listing.students==null || listing.students.length==0){
      throw new Error('Student list Empty!!');
    }
    var factory = getFactory();
    var studentListing = factory.newResource('composer.education.supply', 'StudentListingContract',Math.random().toString(36).substring(3));
    studentListing.status= 'FRESHMEN';
    studentListing.school=listing.school;
    studentListing.owner=listing.user;
    studentListing.students=[];
  	listing.students.forEach(function (item) {
   		  var studentInfo = item.split(',');
        var student = factory.newResource('composer.education.supply', 'Student',Math.random().toString(36).substring(3));
        student.firstname=studentInfo[0]
        student.lastname=studentInfo[1]
        student.coins = 100
        student.status = studentListing.status;
        studentListing.students.push(student);
	  });
    return  getAssetRegistry('composer.education.supply.StudentListingContract')
            .then(function(listingRegistry) {
              return listingRegistry.add(studentListing);
            });
}

/**
 * Create new staff listing contract for the list of staff
 * @param {composer.education.supply.createStaffListing} createStaffListing
 * @transaction
 */
function createStaffListing(listing) {
    if(listing.staff==null || listing.staff.length==0){
      throw new Error('Staff list Empty!!');
    }
    var factory = getFactory();
    var staffListing = factory.newResource('composer.education.supply', 'StaffListingContract',Math.random().toString(36).substring(3));
    staffListing.school=listing.school;
    staffListing.owner=listing.user;
    staffListing.staff=[];
    listing.staff.forEach(function (item) {
        var staffInfo = item.split(',');
        var staff = factory.newResource('composer.education.supply', 'Staff');
        staff.firstname=staffInfo[0]
        staff.lastname=staffInfo[1]
        staff.school = staffListing.school
        staffListing.staff.push(student);
    });
    return  getAssetRegistry('composer.education.supply.StudentListingContract')
            .then(function(listingRegistry) {
              return listingRegistry.add(studentListing);
            });
}

/**
 * Transfer the product listing to new owner
 * @param {composer.education.supply.transferListing} transferListing
 * @transaction
 */
function transferListing(listing) {
  var studentListing = listing.studentListing;
  studentListing.school= listing.newSchool;
  var newOwnerReg = null;
   	return getParticipantRegistry('composer.education.supply.School')
          .then(function(registry) {
	     		      newOwnerReg=registry;
                return registry.exists(listing.newSchool.getIdentifier());
           })
  		    .then(function(check) {
                if(check){
                    return  getAssetRegistry('composer.education.supply.StudentListingContract')
                }
                else{
                  throw new Error('Please provide correct details for new school');
                }
           })
  		    .then(function(listingRegistry) {
                return listingRegistry.update(studentListing);
           });
}


/**
 * Update exempted list
 * @param {composer.education.supply.updateExemptedList} updateExemptedList
 * @transaction
 */
function updateExemptedList(list) {
    if(list.newExemptedSchoolIds!=null && list.newExemptedSchoolIds.length>0){
        list.newExemptedSchoolIds.forEach(function (item) {
            list.regulator.exemptedSchoolIds.push(item);
        });
    }
    if(list.newExemptedStudentIds!=null && list.newExemptedStudentIds.length>0){
        list.newExemptedStudentIds.forEach(function (item) {
        list.regulator.exemptedStudentIds.push(item);
        });
    }
    return getParticipantRegistry('composer.education.supply.Regulator')
           .then(function(registry){
              return registry.update(list.regulator);
           });
}

