import Cookies from 'js-cookie';

let BASE_URL = "https://github.com/login/oauth/authorize";
let CLIENT_ID = "9932c96eb7ba87e1a74a";

function beginLogin() {
  // Save what page we were on when logging in.
  let oauth_redirect_url = encodeURI(window.location);
  Cookies.set('oauth_redirect_url', oauth_redirect_url);

  // Start Github OAuth process.
  window.location = `${BASE_URL}?client_id=${CLIENT_ID}`;
}

function maybeFinishLogin() {
  if (window.location.pathname !== "/login.html") {
    return false;
  }

  let user = getUserFromParams();
  setUserToCookies(user);

  let oauth_redirect_url = decodeURI(Cookies.get('oauth_redirect_url'));
  if (!oauth_redirect_url) {
    throw "Expected oauth redirect url; got none?";
  }

  window.location = oauth_redirect_url;

  return true;
}

function getUserFromParams() {
  let params = (new URL(document.location)).searchParams;
  let user = {
    githubId: params.get("github_id"),
    githubLogin: params.get("github_login"),
    githubName: params.get("github_name"),
    secretCode: params.get("secret_code"),
  };

  validateUser(user);

  return user;
}

function logoutUser() {
  Cookies.remove("githubLogin");
  Cookies.remove("secretCode");

  // Trigger reload of the page now that there is no user.
  window.location.reload();
}

function setUserToCookies(user) {
  Cookies.set("githubId", user.githubId);
  Cookies.set("githubLogin", user.githubLogin);
  Cookies.set("githubName", user.githubName);
  Cookies.set("secretCode", user.secretCode);
}

function validateUser(user) {
  if (!user.githubId) {
    throw "Expected github id for user";
  }
  if (!user.githubLogin) {
    throw "Expected github login for user";
  }
  if (!('githubName' in user)) {
    throw "Expected github name to be at least a key for user";
  }
  if (!user.secretCode) {
    throw "Expected secret code for user";
  }
}

let cachedCookiesUser = null;
function getUserFromCookies() {
  if (cachedCookiesUser) {
    return cachedCookiesUser;
  }

  let user = {
    githubId: Cookies.get("githubId"),
    githubLogin: Cookies.get("githubLogin"),
    githubName: Cookies.get("githubName"),
    secretCode: Cookies.get("secretCode"),
  };

  if ((!user.githubId) || (!user.githubLogin) || (!user.secretCode)) {
    return null;
  }

  cachedCookiesUser = user;
  return cachedCookiesUser;
}

export default {
  beginLogin,
  getUserFromCookies,
  logoutUser,
  maybeFinishLogin,
  setUserToCookies,
}
