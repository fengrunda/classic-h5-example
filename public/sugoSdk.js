/* eslint-disable */
var SUGOIO_LIB_URL = "//sugoapi.thinkinpower.com/_bc/sugo-sdk-js/libs/sugoio-latest.min.js";
window.sugo = 'none'
  // var SUGOIO_LIB_URL = "//58.63.110.97:1180/_bc/sugo-sdk-js/libs/sugoio-latest.min.js";
  ! function (e, o) {
    function t(e, o) {
      for (var t = 0, n = e.length; t < n; t++) o(e[t], t, e)
    }
    if (!o.__SV) {
      var n, r, s, c = window,
        i = "sugoio";
      c[i] = o;
      try {
        ! function (o) {
          var t = c.atob(o),
            n = JSON.parse(t).state,
            r = {
              accessToken: n.access_token,
              accessTokenExpiresAt: Date.now() + 1e3 * Number(n.expires_in),
              projectToken: n.token,
              projectId: n.project_id,
              userId: n.user_id,
              choosePage: n.choose_page
            };
          c.sessionStorage.setItem("editorParams", JSON.stringify(r)), n.hash ? c.location.hash = n.hash : c.history ?
            c.history.replaceState("", e.title, c.location.pathname + c.location.search) : c.location.hash = ""
        }(c.location.hash.replace("#", ""))
      } catch (a) {} finally {
        ! function (o) {
          var n = {},
            r = e,
            s =
            "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu"
            .split(" ");
          o.proxy = {
            proxy: function (e, t) {
              return (n[e] || (n[e] = [])).push(t), o.proxy
            },
            off: function (e, r) {
              var s = n[e] || [],
                c = [];
              return t(s, function (e) {
                e !== r && c.push(e)
              }), s[e] = c, o.proxy
            }
          }, t(s, function (e) {
            n[e] = [],
              function (e, o, t) {
                "function" == typeof e.addEventListener ? e.addEventListener(o, t, !0) : e.attachEvent("on" + o,
                  t)
              }(r, e, function (o) {
                try {
                  t(n[e], function (e) {
                    e(o)
                  })
                } catch (a) {
                  console && "function" == typeof console.error && console.error(a.stack)
                }
              })
          })
        }(o)
      }
      o._i = [], o.init = function (e, n, r) {
          var c = o;
          void 0 !== r ? c = o[r] = [] : r = i, c.people = c.people || [], c.toString = function (e) {
            var o = i;
            return r !== i && (o += "." + r), e || (o += " (stub)"), o
          }, c.people.toString = function () {
            return c.toString(1) + ".people (stub)"
          }, t(s = "time_event track track_pageview register register_once unregister set_config".split(" "),
            function (e) {
              ! function (e, o) {
                var t = o.split(".");
                2 === t.length && (e = e[t[0]], o = t[1]), e[o] = function () {
                  e.push([o].concat(Array.prototype.slice.call(arguments, 0)))
                }
              }(c, e)
            }), o._i.push([e, n, r])
        }, o.__SV = 1.2, (n = e.createElement("script")).type = "text/javascript", n.async = !0, "undefined" !=
        typeof SUGOIO_CUSTOM_LIB_URL ? n.src = SUGOIO_CUSTOM_LIB_URL : "file:" === c.location.protocol &&
        SUGOIO_LIB_URL.match(/^\/\//) ? n.src = "https:" + SUGOIO_LIB_URL : n.src = SUGOIO_LIB_URL, (r = e.getElementsByTagName(
          "script")[0]).parentNode.insertBefore(n, r)
    }
  }(document, window.sugoio || []);
  // 配置生产或测试环境 token Id
var suguoToken = window.location.host.match('test') ? '631373754d22a67489c79fca029b7339' : '394a57ee1879b7948901a495dad2ebbe'
var suguoID = window.location.host.match('test') ? 'com_HJTeE6YmQ_project_rymqKxcXX' : 'com_HJTeE6YmQ_project_S1dXHDdEX'
sugoio.init(suguoToken, { // 项目TOKEN
  project_id: suguoID, // 项目ID
  enable_hash: true,
  api_host: 'https://sugoapi.thinkinpower.com', // sugoio-latest.min.js文件以及数据上报的地址
  app_host: 'https://sugoapi.thinkinpower.com', // 可视化配置时服务端地址
  decide_host: 'https://sugoapi.thinkinpower.com', // 加载已埋点配置地址
  loaded: function (lib) {}, // **sugoio** **sdk** 加载完成回调函数
  DEBUG: false // 是否启用debug
});
