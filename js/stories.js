"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup");
  $navMainLinks.show();
  const showFavorite = Boolean(currentUser);
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
      <div id="divId">
      ${showFavorite ? addFavoriteStar(story, currentUser) : ""} 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>

        <small class="story-author">by ${story.author}</small>

        <small class="story-user">posted by ${story.username}</small>
        
        <button class="deleteButton">delete</button>
      <hr>
      </li>
      </div>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();

}


function putFavoritesListOnPage(){

  $favoriteStories.empty();
  console.log(currentUser.favorites.length);

  for(let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $favoriteStories.append($story);
    console.log(story)
  }
  
}

function addFavoriteStar(story, user){
  const isFavorite = user.isFavorite(story);
  const star = isFavorite ? "fas" : "far";
  return ` <span class='star'><i class='${star} fa-star'></i></span>`
} 


async function submitNewStory(e){
  e.preventDefault();
  console.debug("submitNewStory");
  const title = $("#titleInput").val();
  const author = $("#authorInput").val();
  const url = $("#urlInput").val();
  const username = currentUser.username;
  const newStoryData = { title, author, url, username };
  console.log(newStoryData);

  let story = await storyList.addStory(currentUser, newStoryData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.childElement.append($story);

  await showUsersStories()
}



function showUsersStories() {
  console.debug("showUsersStories")


  if(currentUser.ownStories.length === 0){
    $("#ownStories").append(`<p> No stories yet!</p>`)
  }
  else {
    console.log('WE HAVE STORIES')
    for(let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story)
      $("#ownStories").append($story)
    }
  }

  $("#ownStories").show()
  $allStoriesList.empty();
}


function showFavorites(){
  console.debug("showFavorites");
  $favorites.empty();
  let $faves;
  if(currentUser.favorites.length === 0){
    $favorites.append(`<p> No favorites added yet! </p>`)
  }
  else{
    for(let fav of currentUser.favorites){
      $faves = generateStoryMarkup(fav);
      $favorites.append($faves)
    }
  }

  $favorites.show()
}


async function deleteStory(e){
  let $target = $(e.target)
  let li = $target.closest("li");
  let storyId = li.attr("id")
  console.log(storyId)
  $target.closest("li").remove()
  await storyList.removeStory(currentUser, storyId);
}


async function addOrRemoveFavorite(e){
  console.debug("addOrRemoveFavorite")
  const target = $(e.target);
  const li = target.closest("li");
  const storyId = li.attr("id");
  console.log(storyId)
  const story = storyList.stories.find(s => s.storyId === storyId);
  console.log(story)

  if(target.hasClass("far")){
    console.log(target.closest("li"));
    await currentUser.addFavorite(story)
    target.toggleClass("fas")
    console.log("YEP")
  }
  else{
    target.toggleClass("fas")
    await currentUser.removeFavorite(story)
    console.log('OPPOSITEEEE should be ADDED',target)
  }
}

$("#addNewStory").on("submit",submitNewStory)
$allStoriesList.on("click", ".star", addOrRemoveFavorite)
$allStoriesList.on("click", ".deleteButton", deleteStory)

