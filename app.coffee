Nimbus.Auth.setup("Dropbox", "lejn01o1njs1elo", "2f02rqbnn08u8at", "diary_app") #switch this with your own app key (please!!!!)

Entry = Nimbus.Model.setup("Entry", ["text", "time", "tags"])

#function to add a new entry
window.create_new_entry = ()->
  console.log("create new entry called")
  
  content = $("#writearea").val()
  if content isnt ""
    hashtags = twttr.txt.extractHashtags(content)
    console.log("hashtags", hashtags)
    x = Entry.create(text: content, time: (new Date()).toString(), tags: hashtags )
    
    $("#writearea").val("") #clear the div afterwards
    
    template = render_entry(x)
    $(".holder").prepend(template)

window.filter_entry = (e) ->
  console.log("filter entries", e)
  $(".feed").hide()
  $(".#{e}").show()
  $("#filter").val("#"+e)

window.render_entry = (x) ->
  d = new Date(x.time)
  timeago = jQuery.timeago(d);
  
  n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  processed_text = x.text
  tag_string = ""
  
  if x.tags?
    for t in x.tags
      tag_string = tag_string + t + " "
      console.log(t)
      console.log(processed_text)
      console.log(tag_string)
      processed_text = processed_text.replace("#"+t, "<a onclick='filter_entry(\"#{ t }\");return false;'>##{ t }</a>")
  
  """<div class='feed #{ tag_string }' id='#{x.id}'><div class='feed_content'>
  <header>
      <div class="date avatar"><p>#{ d.getDate() }<span>#{ n[d.getMonth()] }</span></p></div>
      <p class="diary_text" id="#{ x.id }" contenteditable>#{ processed_text }</p>
      <div class="timeago">#{ timeago }</div>
      <div class='actions'>
        <a onclick='delete_entry("#{ x.id }")'>delete</a>
      </div>
  </header>
  </div></div>"""

window.delete_entry = (id) ->
  x = Entry.find(id)
  $(".feed#"+id).remove()
  x.destroy()

#initialization
jQuery ($) ->
  for x in Entry.all()
    template = render_entry(x)
    $(".holder").prepend(template)

  for x in $(".diary_text")
    $(x).blur( (x)-> 
      e = Entry.find(x.target.id)
      e.text = x.target.innerHTML
      hashtags = twttr.txt.extractHashtags(x.target.innerHTML)
      console.log("hashtags", hashtags)
      e.tags = hashtags
      
      e.save()
    )
  
  #bind the filter section
  $("#filter").keyup( ()->
    if $("#filter").val() isnt "" and $( "."+ $("#filter").val().replace("#", ""))
      window.filter_entry( $("#filter").val().replace("#", "") )
    if $("#filter").val() is ""
      $(".feed").show()
  )

exports = this #this is needed to get around the coffeescript namespace wrap
exports.Entry = Entry