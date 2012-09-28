// Generated by CoffeeScript 1.3.3
(function() {
  var Entry, exports;

  Nimbus.Auth.setup("Dropbox", "lejn01o1njs1elo", "2f02rqbnn08u8at", "diary_app");

  Entry = Nimbus.Model.setup("Entry", ["text", "create_time", "tags"]);

  Nimbus.Auth.authorized_callback = function() {
    if (Nimbus.Auth.authorized()) {
      return $("#loading").fadeOut();
    }
  };

  window.create_new_entry = function() {
    var content, hashtags, template, x;
    console.log("create new entry called");
    content = $("#writearea").val();
    if (content !== "") {
      hashtags = twttr.txt.extractHashtags(content);
      x = Entry.create({
        text: content,
        create_time: (new Date()).toString(),
        tags: hashtags
      });
      $("#writearea").val("");
      template = render_entry(x);
      return $(".holder").prepend(template);
    }
  };

  window.filter_entry = function(e) {
    console.log("filter entries", e);
    $(".feed").hide();
    $("." + e).show();
    $("#filter").val("#" + e);
    return $("#x_button").show();
  };

  window.render_entry = function(x) {
    var d, n, processed_text, t, tag_string, timeago, _i, _len, _ref;
    d = new Date(x.create_time);
    timeago = jQuery.timeago(d);
    n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    processed_text = x.text;
    tag_string = "";
    if (x.tags != null) {
      _ref = x.tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        t = _ref[_i];
        tag_string = tag_string + t + " ";
        processed_text = processed_text.replace("#" + t, "<a onclick='filter_entry(\"" + t + "\");return false;'>#" + t + "</a>");
      }
    }
    return "<div class='feed " + tag_string + "' id='" + x.id + "'><div class='feed_content'>\n<header>\n    <div class=\"date avatar\"><p>" + (d.getDate()) + "<span>" + n[d.getMonth()] + "</span></p></div>\n    <p class=\"diary_text\" id=\"" + x.id + "\" contenteditable>" + processed_text + "</p>\n    <div class=\"timeago\">" + timeago + "</div>\n    <div class='actions'>\n      <a onclick='delete_entry(\"" + x.id + "\")'>delete</a>\n    </div>\n</header>\n</div></div>";
  };

  window.delete_entry = function(id) {
    var x;
    x = Entry.find(id);
    $(".feed#" + id).remove();
    return x.destroy();
  };

  window.clear_tags = function() {
    $("#filter").val("");
    $(".feed").show();
    return $("#x_button").hide();
  };

  window.datesort = function(a, b) {
    if (a.create_time < b.create_time) {
      return -1;
    } else {
      return 1;
    }
  };

  jQuery(function($) {
    var template, x, _i, _j, _len, _len1, _ref, _ref1;
    if (Nimbus.Auth.authorized()) {
      $("#loading").fadeOut();
    }
    $("#x_button").hide();
    _ref = Entry.all().sort(datesort);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      template = render_entry(x);
      $(".holder").prepend(template);
    }
    _ref1 = $(".diary_text");
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      x = _ref1[_j];
      $(x).blur(function(x) {
        var e, hashtags, rendered;
        e = Entry.find(x.target.id);
        e.text = x.target.innerHTML;
        hashtags = twttr.txt.extractHashtags(x.target.innerHTML);
        e.tags = hashtags;
        rendered = render_entry(e);
        $("#" + e.id).replaceWith(rendered);
        return e.save();
      });
    }
    return $("#filter").keyup(function() {
      if ($("#filter").val() !== "" && $("." + $("#filter").val().replace("#", ""))) {
        window.filter_entry($("#filter").val().replace("#", ""));
        $("#x_button").show();
      }
      if ($("#filter").val() === "") {
        return clear_tags();
      }
    });
  });

  exports = this;

  exports.Entry = Entry;

}).call(this);
