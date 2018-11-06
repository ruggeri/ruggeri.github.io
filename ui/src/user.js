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
    login: params.get("login"),
    secretCode: params.get("secret_code"),
  };

  validateUser(user);

  return user;
}

function setUserToCookies(user) {
  Cookies.set("login", user.login);
  Cookies.set("secretCode", user.secretCode);
}

function validateUser(user) {
  if (!user.login) {
    throw "Expected github login in params";
  }
  if (!user.secretCode) {
    throw "Expected secret code in params";
  }
}

let cachedCookiesUser = null;
function getUserFromCookies() {
  if (!cachedCookiesUser) {
    cachedCookiesUser = {
      login: Cookies.get("login"),
      secretCode: Cookies.get("secretCode"),
    };
  }

  validateUser(cachedCookiesUser);
  return cachedCookiesUser;
}

export default {
  beginLogin,
  getUserFromCookies,
  maybeFinishLogin,
}
