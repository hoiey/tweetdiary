// Generated by CoffeeScript 1.3.3
(function() {
  var Entry, exports;

  Nimbus.Auth.setup("Dropbox", "lejn01o1njs1elo", "2f02rqbnn08u8at", "diary_app");

  Entry = Nimbus.Model.setup("Entry", ["text", "time"]);

  window.create_new_entry = function() {
    var content, template, x;
    console.log("create new entry called");
    content = $("#writearea").val();
    if (content !== "") {
      x = Entry.create({
        text: content,
        time: (new Date()).toString()
      });
      $("#writearea").val("");
      template = render_entry(x);
      return $(".holder").prepend(template);
    }
  };

  window.render_entry = function(x) {
    var d, n, timeago;
    d = new Date(x.time);
    timeago = jQuery.timeago(d);
    n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return "<div class='feed' id='" + x.id + "'><div class='feed_content'>\n<header>\n    <div class=\"date avatar\"><p>" + (d.getDate()) + "<span>" + n[d.getMonth()] + "</span></p></div>\n    <p class=\"diary_text\">" + x.text + "</p>\n    <div class=\"timeago\">" + timeago + "</div>\n    <div class='actions'>\n      <a onclick=''>save</a>\n      <a onclick=''>delete</a>\n    </div>\n</header>\n</div></div>";
  };

  window.onTestChange = function() {
    var key;
    key = window.event.keyCode;
    if (key === 13) {
      window.create_new_entry();
      return true;
    } else {
      return true;
    }
  };

  jQuery(function($) {
    var template, x, _i, _len, _ref, _results;
    _ref = Entry.all();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      template = render_entry(x);
      _results.push($(".holder").prepend(template));
    }
    return _results;
  });

  exports = this;

  exports.Entry = Entry;

}).call(this);
