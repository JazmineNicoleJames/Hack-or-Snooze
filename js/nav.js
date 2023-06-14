"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */



function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navMainLinks.show();
  $navLogin.hide();
  $navLogOut.show();
  $addStorySubmit.show();
  $('#favorites').show();
  $('#myStories').show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navAddStory(evt){
  console.debug("navAddStory", evt);
  $("#addNewStory").show();
}

$("#addStorySubmit").on("click", navAddStory);


function navMyStories(e){
  console.log(e.target)
  hidePageComponents();
  showUsersStories();
  $('ownStories').show()
}

$(".nav-main-links").on("click", "#myStories", navMyStories)

function navMyFavorites(e){
  hidePageComponents();
  showFavorites();
  $("favoriteStories").show()
}
$(".nav-main-links").on("click", "#favorites", navMyFavorites)
