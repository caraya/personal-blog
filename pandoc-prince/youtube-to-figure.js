// Find all lite-youtube elements in the document
var videos = document.querySelectorAll("lite-youtube");

for (var i = 0; i < videos.length; i++) {
  var v = videos[i];
  var id = v.getAttribute("videoid");

  if (!id) continue;

  // Create standard HTML figure elements
  var fig = document.createElement("figure");
  fig.className = "youtube-figure";

  var img = document.createElement("img");
  img.src = "http://img.youtube.com/vi/" + id + "/0.jpg";
  img.alt = "YouTube Video Thumbnail";

  var cap = document.createElement("figcaption");
  cap.innerHTML = "<strong>🎥 Video Reference:</strong> https://youtube.com/watch?v=" + id;

  fig.appendChild(img);
  fig.appendChild(cap);

  // Replace the custom web component with the print-ready figure
  v.parentNode.replaceChild(fig, v);
}