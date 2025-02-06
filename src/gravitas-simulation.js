/************************************************************
 * Full Gravitas (Large, Merged Version)
 * - Subreddit + user path detection
 * - FEED_TYPES = ["hot", "new", "top", "topYear"]
 * - Skip auto-absorption for GIF
 * - Mark GIF spheres lighter
 * - Show info pane for everything else on auto-absorb
 * - On click, always show the info pane (even GIF)
 * - Queue-based insertion, multiple PMNs, pause/play
 * - ADD: Back/Forward buttons + icons
 ************************************************************/

import * as THREE from 'three';

export function createGravitasSimulation(parentEl) {

  // ==============================
  // 1. Create the container & sub-elements in the DOM
  // ==============================
  const container = document.createElement("div");
  container.id = "simulation-container";
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.margin = "0 auto";
  container.style.backgroundColor = "#F2F2F2";

  // Centered text
  const centeredText = document.createElement("div");
  centeredText.id = "centeredText";
  centeredText.style.position = "absolute";
  centeredText.style.top = "50%";
  centeredText.style.left = "50%";
  centeredText.style.transform = "translate(-50%, -50%)";
  centeredText.style.zIndex = "9999";
  centeredText.style.fontSize = "20px";
  centeredText.style.color = "#000";
  centeredText.style.fontFamily = "'Montserrat', sans-serif";
  centeredText.style.textAlign = "center";
  centeredText.innerHTML = "<strong>Reddit Threads</strong> driven by physics.";
  container.appendChild(centeredText);

  // Top center container
  const topCenterContainer = document.createElement("div");
  topCenterContainer.id = "top-center-container";
  topCenterContainer.style.position = "absolute";
  topCenterContainer.style.top = "10px";
  topCenterContainer.style.left = "50%";
  topCenterContainer.style.transform = "translateX(-50%)";
  topCenterContainer.style.zIndex = "9999";
  topCenterContainer.style.display = "flex";
  topCenterContainer.style.alignItems = "center";
  // Adjust spacing if needed
  topCenterContainer.style.gap = "20px";

  // Simple Logo
  const logo = document.createElement("img");
  logo.id = "logo";
  logo.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/gravitas-logo-solo.png";
  logo.alt = "Gravitas Logo";
  logo.style.height = "30px";
  logo.style.cursor = "pointer";
  logo.style.display = "inline-flex";
  logo.style.alignItems = "center";
  logo.style.justifyContent = "center";
  logo.style.userSelect = "none";
  logo.style.webkitUserSelect = "none";
  logo.style.msUserSelect = "none";
  logo.style.MozUserSelect = "none";
  logo.style.verticalAlign = "middle";
  logo.style.marginTop = "10px";


  // "Threads" Button
  const discoverBtn = document.createElement("button");
  discoverBtn.id = "startButton";
  discoverBtn.textContent = "Threads";
  discoverBtn.style.padding = "10px 20px";
  discoverBtn.style.backgroundColor = "#FFFFFF";
  discoverBtn.style.border = "none";
  discoverBtn.style.borderRadius = "4px";
  discoverBtn.style.cursor = "pointer";
  discoverBtn.style.color = "black";
  discoverBtn.style.display = "inline-flex";
  discoverBtn.style.alignItems = "center";
  discoverBtn.style.justifyContent = "center";
  discoverBtn.style.userSelect = "none";
  discoverBtn.style.webkitUserSelect = "none";
  discoverBtn.style.msUserSelect = "none";
  discoverBtn.style.MozUserSelect = "none";
  // Prevent text clipping
  discoverBtn.style.minWidth = "80px";

  // Play/Pause Icon (clickable <img>)
  const playPauseIcon = document.createElement("img");
  playPauseIcon.id = "togglePlayIcon";
  playPauseIcon.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/icons/fa-solid-pause.png"; 
  playPauseIcon.style.width = "20px";
  playPauseIcon.style.height = "20px";
  playPauseIcon.style.cursor = "pointer";
  playPauseIcon.style.userSelect = "none";
  playPauseIcon.draggable = false;
  playPauseIcon.style.marginTop = "10px";

  // Back Icon
  const backIcon = document.createElement("img");
  backIcon.id = "backIcon";
  backIcon.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/icons/fa-solid-backward.png";
  backIcon.style.width = "20px";
  backIcon.style.height = "20px";
  backIcon.style.cursor = "pointer";
  backIcon.style.userSelect = "none";
  backIcon.draggable = false;
  backIcon.style.marginTop = "10px";

  // Forward Icon
  const forwardIcon = document.createElement("img");
  forwardIcon.id = "forwardIcon";
  forwardIcon.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/icons/fa-solid-forward.png";
  forwardIcon.style.width = "20px";
  forwardIcon.style.height = "20px";
  forwardIcon.style.cursor = "pointer";
  forwardIcon.style.userSelect = "none";
  forwardIcon.draggable = false;
  forwardIcon.style.marginTop = "10px";

  // Speed slider wrapper
  const speedWrapper = document.createElement("div");
  speedWrapper.style.display = "inline-flex";
  speedWrapper.style.alignItems = "center";
  speedWrapper.style.gap = "8px";

  // Create the label
  const speedLabel = document.createElement("label");
  speedLabel.id = "speedLabel";
  speedLabel.textContent = "";
  speedLabel.style.color = "black";
  speedLabel.style.fontSize = "12px";
  speedLabel.style.userSelect = "none";
  // Ensure there's enough width to show e.g. "3s"
  speedLabel.style.minWidth = "24px";

  // Create the slider
  const speedSlider = document.createElement("input");
  speedSlider.id = "speedSlider";
  speedSlider.type = "range";
  speedSlider.min = "1";
  speedSlider.max = "20";
  speedSlider.value = "3";
  speedSlider.style.cursor = "pointer";

  // Append label & slider to the wrapper
  speedWrapper.appendChild(speedLabel);
  speedWrapper.appendChild(speedSlider);

  // Append everything in order
  topCenterContainer.appendChild(speedWrapper);
  topCenterContainer.appendChild(logo);
  topCenterContainer.appendChild(discoverBtn);
  topCenterContainer.appendChild(playPauseIcon);
  topCenterContainer.appendChild(backIcon);
  topCenterContainer.appendChild(forwardIcon);

  // Add this container to parent
  container.appendChild(topCenterContainer);

  // "Post List" panel
  const postListPanel = document.createElement("div");
  postListPanel.id = "postListPanel";
  postListPanel.style.position = "absolute";
  postListPanel.style.right = "20px";
  postListPanel.style.bottom = "20px";
  postListPanel.style.width = "200px";
  postListPanel.style.maxHeight = "700px";
  postListPanel.style.overflowY = "auto";
  postListPanel.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  postListPanel.style.padding = "10px";
  postListPanel.style.borderRadius = "4px";
  postListPanel.style.fontSize = "13px";
  postListPanel.style.pointerEvents = "auto";
  postListPanel.style.display = "none";
  postListPanel.style.color = "#000";
  postListPanel.style.zIndex = "9999";
  postListPanel.style.userSelect = "none";
  postListPanel.style.webkitUserSelect = "none";
  postListPanel.style.msUserSelect = "none";
  postListPanel.style.MozUserSelect = "none";
  container.appendChild(postListPanel);

  // Absorbed Image Container
  const absorbedImageContainer = document.createElement("div");
  absorbedImageContainer.id = "absorbedImageContainer";
  absorbedImageContainer.style.position = "absolute";
  absorbedImageContainer.style.top = "50%";
  absorbedImageContainer.style.left = "50%";
  absorbedImageContainer.style.transform = "translate(-50%, -50%)";
  absorbedImageContainer.style.zIndex = "9999";
  absorbedImageContainer.style.display = "inline-block";
  absorbedImageContainer.style.minWidth = "480px";
  absorbedImageContainer.style.maxWidth = "480px";
  absorbedImageContainer.style.maxHeight = "700px";
  absorbedImageContainer.style.overflow = "hidden";
  absorbedImageContainer.style.userSelect = "none";
  absorbedImageContainer.style.webkitUserSelect = "none";
  absorbedImageContainer.style.msUserSelect = "none";
  absorbedImageContainer.style.MozUserSelect = "none";

  const absorbedImageLink = document.createElement("a");
  absorbedImageLink.id = "absorbedImageLink";
  absorbedImageLink.href = "#";
  absorbedImageLink.target = "_blank";
  absorbedImageLink.style.display = "block";
  absorbedImageLink.style.border = "2px solid rgba(255, 255, 255, 0)";
  absorbedImageLink.style.borderRadius = "4px";
  absorbedImageLink.style.userSelect = "none";
  absorbedImageLink.draggable = false;

  const absorbedImage = document.createElement("img");
  absorbedImage.id = "absorbedImage";
  absorbedImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  absorbedImage.alt = "Reddit Preview Image";
  absorbedImage.style.display = "block";
  absorbedImage.style.width = "auto";
  absorbedImage.style.height = "auto";
  absorbedImage.style.minWidth = "480px";
  absorbedImage.style.maxWidth = "100%";
  absorbedImage.style.maxHeight = "100%";
  absorbedImage.style.objectFit = "contain";
  absorbedImage.style.userSelect = "none";
  absorbedImage.draggable = false;

  // prevent drag
  absorbedImage.addEventListener("dragstart", (e) => e.preventDefault());
  absorbedImageLink.addEventListener("dragstart", (e) => e.preventDefault());
  absorbedImageLink.appendChild(absorbedImage);

  // <video> for .mp4
  const absorbedVideo = document.createElement("video");
  absorbedVideo.id = "absorbedVideo";
  absorbedVideo.style.display = "none"; // hidden by default
  absorbedVideo.style.width = "auto";
  absorbedVideo.style.height = "auto";
  absorbedVideo.style.maxWidth = "100%";
  absorbedVideo.style.maxHeight = "100%";
  absorbedVideo.style.objectFit = "contain";
  absorbedVideo.setAttribute("controls", "true");
  absorbedVideo.setAttribute("loop", "true");
  absorbedVideo.setAttribute("autoplay", "true");
  absorbedVideo.muted = true;  // needed for most browsers to autoplay

  // Put image/video in same container
  absorbedImageContainer.appendChild(absorbedImageLink);
  absorbedImageContainer.appendChild(absorbedVideo);
  container.appendChild(absorbedImageContainer);

  // Absorbed Details Container
  const absorbedDetailsContainer = document.createElement("div");
  absorbedDetailsContainer.id = "absorbedDetailsContainer";
  absorbedDetailsContainer.style.position = "absolute";
  absorbedDetailsContainer.style.bottom = "35px";
  absorbedDetailsContainer.style.left = "50%";
  absorbedDetailsContainer.style.transform = "translateX(-50%)";
  absorbedDetailsContainer.style.zIndex = "9999";
  absorbedDetailsContainer.style.width = "400px";
  absorbedDetailsContainer.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
  absorbedDetailsContainer.style.border = "2px solid #000";
  absorbedDetailsContainer.style.borderRadius = "8px";
  absorbedDetailsContainer.style.padding = "12px";
  absorbedDetailsContainer.style.display = "none";
  absorbedDetailsContainer.style.textAlign = "center";
  absorbedDetailsContainer.style.fontFamily = "'Montserrat', sans-serif";
  absorbedDetailsContainer.style.userSelect = "none";
  absorbedDetailsContainer.style.webkitUserSelect = "none";
  absorbedDetailsContainer.style.msUserSelect = "none";
  absorbedDetailsContainer.style.MozUserSelect = "none";

  const detailsTitle = document.createElement("h3");
  detailsTitle.id = "detailsTitle";
  detailsTitle.style.margin = "0 0 10px";
  detailsTitle.style.fontSize = "16px";
  detailsTitle.style.color = "#333";

  const detailsPrice = document.createElement("p");
  detailsPrice.id = "detailsPrice";
  detailsPrice.style.margin = "0";
  detailsPrice.style.fontSize = "16px";
  detailsPrice.style.color = "#555";

  absorbedDetailsContainer.appendChild(detailsTitle);
  absorbedDetailsContainer.appendChild(detailsPrice);
  container.appendChild(absorbedDetailsContainer);


  // Finally, add this container to the user-chosen parent
  parentEl.appendChild(container);

  // For text override
  const centerEl = document.getElementById("centeredText");

  // =====================================
  //  IIFE to hold our big logic
  // =====================================
  (function() {

    // Global data
    let dnData = [];
    let queuedDNs = [];
    let lineSegments = null;
    let linePositions = null;
    let scene, camera, renderer;
    let dnInstancedMesh = null;
    let allMeshes = [];
    let clock;
    let timeSinceAbsorption = 0;
    let ABSORPTION_INTERVAL = 3.0;

    const boundaryX = 700, boundaryY = 600, boundaryZ = 400;
    const DRAG_THRESHOLD = 5;
    let isMouseDown = false;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let orbitAzimuth = 0;
    let orbitPolar = Math.PI * 0.5;
    let orbitRadius = 400;
    let sceneCenter = new THREE.Vector3();
    let amplitude = new THREE.Vector3(20, 20, 20);

    // For play/pause
    let isPaused = false;

    // We'll store multiple feed types
    const FEED_TYPES = ["hot", "new", "top", "topYear"];

    // Array that holds absorbed DNs (latest at the end).
    let absorbedHistory = [];
    // Pointer for "back" navigation (default = -1 means "none shown yet").
    let absorbedHistoryIndex = -1;

    // PMNs: upvoteFactor, commentFactor, newnessFactor
    const pmnMetrics = [
      { metric: "upvoteFactor",  mass: 20 },
      { metric: "commentFactor", mass: 12 },
      { metric: "newnessFactor", mass: 15 }
    ];
    let pmnData = pmnMetrics.map(m => ({
      mesh: null,
      type: "PMN",
      mass: m.mass,
      metric: m.metric,
      position: null
    }));

    // Speed slider
    speedSlider.addEventListener("input", () => {
      // Convert string -> number
      const newValue = parseFloat(speedSlider.value);
      // 1 => 1 second, 20 => 20 seconds, etc.
      ABSORPTION_INTERVAL = newValue;
      // Update the label
      speedLabel.textContent = `${newValue}s`;
    });
    // Initialize once
    speedLabel.textContent = `${ABSORPTION_INTERVAL}s`;

    // Colors for when a user clicks a sphere
    const clickColors = ["#FF6188", "#A9DC76", "#FFD866", "#78DCE8", "#AB9DF2"];

    /************************************************************
     * HELPER: POST LIST
     ************************************************************/
    function updatePostListUI() {
      const panel = document.getElementById("postListPanel");
      panel.innerHTML = "";
      const heading = document.createElement("div");
      heading.textContent = "Absorbed Posts:";
      heading.style.fontWeight = "bold";
      heading.style.marginBottom = "8px";
      panel.appendChild(heading);

      // We want newest on top => iterate reversed
      for (let i = absorbedHistory.length - 1; i >= 0; i--) {
        const item = absorbedHistory[i];
        const link = document.createElement("a");
        link.href = item.postUrl || "#";
        link.target = "_blank";
        link.textContent = item.title || "(untitled)";
        link.style.display = "block";
        link.style.marginBottom = "4px";
        link.style.textDecoration = "none";
        link.style.color = "#0077cc";
        panel.appendChild(link);
      }

      if (absorbedHistory.length > 0) {
        panel.style.display = "block";
      } else {
        panel.style.display = "none";
      }
    }

    /************************************************************
     * HELPER: Absorbed Media (image or mp4)
     ************************************************************/
    function showAbsorbedMedia(imageUrl, videoUrl, redditUrl, postTitle, upvoteCount, isVideo) {
      const container = document.getElementById("absorbedImageContainer");
      const link = document.getElementById("absorbedImageLink");
      const img = document.getElementById("absorbedImage");
      const vid = document.getElementById("absorbedVideo");

      // Make sure link goes to reddit post
      if (link) link.href = redditUrl || "#";

      if (isVideo && videoUrl) {
        // Show <video>, hide <img>
        img.style.display = "none";
        vid.style.display = "block";
        vid.src = videoUrl;
        vid.onclick = () => {
          window.open(redditUrl, "_blank");
        };
        vid.load(); // force reload
      } else {
        // Show <img>, hide <video>
        vid.style.display = "none";
        vid.src = "";
        img.style.display = "block";
        img.src = imageUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      }

      // Reveal container + details
      if (container) container.style.display = "block";
      showDetailsPane(postTitle, upvoteCount);
    }

    function showDetailsPane(title, upvoteCount) {
      const pane = document.getElementById("absorbedDetailsContainer");
      const titleEl = document.getElementById("detailsTitle");
      const priceEl = document.getElementById("detailsPrice");

      if (titleEl) titleEl.textContent = title || "(untitled)";
      if (priceEl) {
        priceEl.textContent = upvoteCount ? `⬆️ Upvotes: ${upvoteCount}` : "No upvotes yet";
      }
      if (pane) pane.style.display = "block";
    }

    function hideDetailsPane() {
      const pane = document.getElementById("absorbedDetailsContainer");
      if (pane) pane.style.display = "none";

      const imgCont = document.getElementById("absorbedImageContainer");
      if (imgCont) imgCont.style.display = "none";
    }

    /************************************************************
     * Show previously absorbed item at index in 'absorbedHistory'
     ************************************************************/
    function showAbsorbedHistoryAtIndex(idx) {
      // bounds-check
      if (idx < 0 || idx >= absorbedHistory.length) return;

      const item = absorbedHistory[idx];
      showAbsorbedMedia(
        item.thumbnailUrl,
        item.videoUrl,
        item.postUrl,
        item.title,
        item.upvoteCount,
        item.isVideo
      );
    }

    /************************************************************
     * Clicking a sphere
     ************************************************************/
    function showClickedDnBriefly(dn, instanceId) {
      const r = dn.redditData;
      const postUrl = r.permalink ? "https://www.reddit.com" + r.permalink : "#";
      const upvoteCount = r.upvoteCount || 0;

      // Display mp4 or image, depending on isVideo
      showAbsorbedMedia(r.thumbnailUrl, dn.videoUrl, postUrl, r.title, upvoteCount, dn.isVideo);

      // Recolor the instance
      const newColor = new THREE.Color(clickColors[Math.floor(Math.random() * clickColors.length)]);
      dnInstancedMesh.setColorAt(instanceId, newColor);
      dnInstancedMesh.instanceColor.needsUpdate = true;
    }

    /************************************************************
     * Orbit drag
     ************************************************************/
    function setupInteraction(domEl) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      domEl.addEventListener("mousedown", e => {
        isMouseDown = true;
        isDragging = false;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      });

      domEl.addEventListener("mousemove", e => {
        if (!isMouseDown) return;
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
          isDragging = true;
        }
        if (isDragging) {
          orbitAzimuth -= deltaX * 0.003;
          orbitPolar -= deltaY * 0.003;
          orbitPolar = Math.max(0.01, Math.min(Math.PI - 0.01, orbitPolar));

          lastMouseX = e.clientX;
          lastMouseY = e.clientY;
        }
      });

      domEl.addEventListener("mouseup", e => {
        if (!isDragging) {
          // Attempt selection
          const rect = domEl.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);

          const intersects = raycaster.intersectObject(dnInstancedMesh, false);
          if (intersects.length > 0) {
            const instanceId = intersects[0].instanceId;
            if (instanceId !== undefined && dnData[instanceId]?.alive) {
              showClickedDnBriefly(dnData[instanceId], instanceId);
            }
          }
        }
        isMouseDown = false;
        isDragging = false;
      });
    }

    /************************************************************
     * 2) Subreddit-based logic
     ************************************************************/
    function getCurrentRedditPathFromUrl() {
      const currentUrl = window.location.href;

      // user-based
      let match = currentUrl.match(/reddit\.com\/user\/([^/]+)/);
      if (match && match[1]) {
        return "user/" + match[1];
      }

      // subreddit-based
      match = currentUrl.match(/reddit\.com\/r\/([^/]+)/);
      if (match && match[1]) {
        return match[1];
      }

      return "popular";
    }

    async function fetchRedditDataViaApi(redditPath, feedType = "hot") {
      let url;
      // user or subreddit
      if (redditPath.startsWith("user/")) {
        // user
        const username = redditPath.split("/")[1];
        url = `https://www.reddit.com/user/${username}/submitted.json?limit=100`;
      } else {
        // sub
        if (feedType === "topYear") {
          url = `https://www.reddit.com/r/${redditPath}/top.json?t=year&limit=100`;
        } else {
          url = `https://www.reddit.com/r/${redditPath}/${feedType}.json?limit=100`;
        }
      }

      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Reddit API error: ${resp.status} - ${resp.statusText}`);
      }
      const json = await resp.json();
      const rawPosts = json.data?.children || [];
      return rawPosts.map((p) => mapRedditPostToSimple(p.data));
    }

    function mapRedditPostToSimple(postData) {
      // Check for reddit_video_preview
      if (
        postData.preview &&
        postData.preview.reddit_video_preview &&
        postData.preview.reddit_video_preview.fallback_url
      ) {
        return {
          title: postData.title || "Untitled",
          upvoteCount: postData.ups || 0,
          commentCount: postData.num_comments || 0,
          permalink: postData.permalink || "",
          createdAt: postData.created_utc ? postData.created_utc * 1000 : Date.now(),
          isVideo: true,
          videoUrl: postData.preview.reddit_video_preview.fallback_url,
          thumbnailUrl: getHighResImageFromRedditPost(postData),
        };
      }

      // check normal is_video
      const isVideoPost = 
        postData.is_video &&
        postData.media &&
        postData.media.reddit_video &&
        postData.media.reddit_video.fallback_url;

      if (isVideoPost) {
        return {
          title: postData.title || "Untitled",
          upvoteCount: postData.ups || 0,
          commentCount: postData.num_comments || 0,
          permalink: postData.permalink || "",
          createdAt: postData.created_utc ? postData.created_utc * 1000 : Date.now(),
          isVideo: true,
          videoUrl: postData.media.reddit_video.fallback_url,
          thumbnailUrl: getHighResImageFromRedditPost(postData),
        };
      }

      // check .gifv from imgur => treat as .mp4
      const finalUrl = postData.url_overridden_by_dest || postData.url || "";
      const domainLower = (postData.domain || "").toLowerCase();
      if (
        domainLower.includes("imgur.com") &&
        finalUrl.toLowerCase().endsWith(".gifv")
      ) {
        // convert .gifv to .mp4
        const mp4Link = finalUrl.replace(/\.gifv$/i, ".mp4");
        return {
          title: postData.title || "Untitled",
          upvoteCount: postData.ups || 0,
          commentCount: postData.num_comments || 0,
          permalink: postData.permalink || "",
          createdAt: postData.created_utc ? postData.created_utc * 1000 : Date.now(),
          isVideo: true,
          videoUrl: mp4Link,
          thumbnailUrl: getHighResImageFromRedditPost(postData),
        };
      }

      // default => treat as image
      return {
        title: postData.title || "Untitled",
        upvoteCount: postData.ups || 0,
        commentCount: postData.num_comments || 0,
        permalink: postData.permalink || "",
        createdAt: postData.created_utc ? postData.created_utc * 1000 : Date.now(),
        isVideo: false,
        videoUrl: "",
        thumbnailUrl: getHighResImageFromRedditPost(postData),
      };
    }

    function getHighResImageFromRedditPost(d) {
      // .gif
      if (d.url && d.url.endsWith(".gif")) {
        return d.url;
      }
      // preview gif
      if (d.preview && d.preview.images && d.preview.images[0]) {
        const variants = d.preview.images[0].variants;
        if (variants && variants.gif && variants.gif.source && variants.gif.source.url) {
          return variants.gif.source.url.replace(/&amp;/g, "&");
        }
      }
      // fallback to preview
      if (d.preview && d.preview.images && d.preview.images.length > 0) {
        const firstImage = d.preview.images[0];
        if (firstImage.source && firstImage.source.url) {
          return firstImage.source.url.replace(/&amp;/g, "&");
        }
      }
      // fallback to thumbnail
      if (d.thumbnail && d.thumbnail.startsWith("http")) {
        return d.thumbnail;
      }
      return "";
    }

    /************************************************************
     * 3) Combined fetch logic: multiple feeds
     ************************************************************/
    async function fetchAllRedditThreads() {
      const redditPath = getCurrentRedditPathFromUrl();
      // user vs sub
      if (redditPath.startsWith("user/")) {
        // fetch once
        const posts = await fetchRedditDataViaApi(redditPath, "hot");
        return posts;
      } else {
        // sub => multiple feeds
        let allPosts = [];
        for (const type of FEED_TYPES) {
          const postsForType = await fetchRedditDataViaApi(redditPath, type);
          allPosts = allPosts.concat(postsForType);
        }
        // deduplicate by permalink
        const uniqueMap = new Map();
        for (let p of allPosts) {
          uniqueMap.set(p.permalink, p);
        }
        return Array.from(uniqueMap.values());
      }
    }

    /************************************************************
     * Convert to DN
     ************************************************************/
    function convertRedditPostsToDNs(posts) {
      const maxX = 700, maxY = 600, maxZ = 400;
      const now = Date.now();

      return posts.map(post => {
        const ageDays = (now - post.createdAt)/(1000*60*60*24);
        const maxDays = 365;
        const clamped = Math.min(ageDays, maxDays);
        const newnessFactor = 1 - (clamped/maxDays);

        const upvoteFactor = Math.min(post.upvoteCount/5000, 1.0);
        const commentFactor = Math.min(post.commentCount/500, 1.0);

        const isGif = post.thumbnailUrl.toLowerCase().endsWith(".gif");

        return {
          redditData: {
            title: post.title,
            upvoteCount: post.upvoteCount,
            permalink: post.permalink,
            thumbnailUrl: post.thumbnailUrl,
            isGif
          },
          isVideo: post.isVideo,
          videoUrl: post.videoUrl || "",
          attributes: {
            upvoteFactor,
            commentFactor,
            newnessFactor
          },
          position: new THREE.Vector3(
            Math.random()*maxX,
            Math.random()*maxY,
            Math.random()*maxZ
          ),
          velocity: new THREE.Vector3(0,0,0),
          mass: 1,
          alive: true
        };
      });
    }

    function calculateDnMass(dn) {
      return pmnData.reduce((total, pmn) => {
        switch (pmn.metric) {
          case "upvoteFactor":
            return total + pmn.mass * dn.attributes.upvoteFactor;
          case "commentFactor":
            return total + pmn.mass * dn.attributes.commentFactor;
          case "newnessFactor":
            return total + pmn.mass * dn.attributes.newnessFactor;
          default:
            return total;
        }
      }, 1);
    }

    function recalculateDnMasses(dnArray) {
      dnArray.forEach(dn => {
        dn.mass = calculateDnMass(dn);
      });
    }

    // fill up to 1000
    function scaleDNsTo1000(dnData) {
      if (!dnData.length) return dnData;
      const origCount = dnData.length;
      while (dnData.length < 1000) {
        const src = dnData[dnData.length % origCount];
        const clone = {
          redditData: { ...src.redditData },
          isVideo: src.isVideo,
          videoUrl: src.videoUrl,
          attributes: { ...src.attributes },
          position: new THREE.Vector3(
            Math.random() * 700,
            Math.random() * 600,
            Math.random() * 400
          ),
          velocity: new THREE.Vector3(0,0,0),
          mass: src.mass,
          alive: true
        };
        dnData.push(clone);
      }
      return dnData;
    }

    /************************************************************
     * init => fetch => create scene => queue
     ************************************************************/
    async function init() {
      try {
        const posts = await fetchAllRedditThreads();
        let rawDNs = convertRedditPostsToDNs(posts);
        // set mass
        rawDNs.forEach(dn => {
          dn.mass = calculateDnMass(dn);
        });
        if (rawDNs.length < 1000) {
          scaleDNsTo1000(rawDNs);
        }
        queuedDNs = rawDNs.slice();
        createEmptyScene();
        startQueueTimer();
      } catch(err) {
        console.error("Error fetching reddit threads:", err.message);
        if (centerEl) {
          centerEl.textContent = "Unable to fetch Reddit data. Sorry.";
        }
      }
    }

    function createEmptyScene() {
      const container = document.getElementById("simulation-container");
      if (!container) return;

      scene = new THREE.Scene();
      scene.background = new THREE.Color("#F2F2F2");

      camera = new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        2000
      );
      renderer = new THREE.WebGLRenderer({ antialias:true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      // Create PMNs
      pmnData.forEach(p => {
        p.position = new THREE.Vector3(
          175 + Math.random()*350,
          150 + Math.random()*300,
          100 + Math.random()*200
        );
      });
      const sphereGeom = new THREE.SphereGeometry(5,16,16);
      const pmnMat = new THREE.MeshBasicMaterial({ color:"#808080" });
      pmnData.forEach(p => {
        const mesh = new THREE.Mesh(sphereGeom, pmnMat);
        mesh.position.copy(p.position);
        scene.add(mesh);
        p.mesh = mesh;
        p.type = "PMN";
        allMeshes.push(p);
      });

      dnData = [];
      dnInstancedMesh = null;
      linePositions = null;
      lineSegments = null;
      scene.add(new THREE.AmbientLight(0xffffff,1));

      orbitAzimuth = 0;
      orbitPolar   = Math.PI*0.5;
      orbitRadius  = 400;

      setupInteraction(container);
      clock = new THREE.Clock();
      animate();
    }

    let queueTimerHandle = null;
    const BATCH_SIZE = 50;
    const QUEUE_INTERVAL_MS = 3000;

    function startQueueTimer() {
      if (queueTimerHandle) clearInterval(queueTimerHandle);
      queueTimerHandle = setInterval(() => {
        if (queuedDNs.length === 0) {
          clearInterval(queueTimerHandle);
          queueTimerHandle = null;
          return;
        }
        const batch = queuedDNs.splice(0,BATCH_SIZE);
        addDNsToScene(batch);
      }, QUEUE_INTERVAL_MS);
    }

    function addDNsToScene(newItems) {
      const startIndex = dnData.length;
      dnData = dnData.concat(newItems);

      if (!dnInstancedMesh) {
        createOrExpandInstancedMesh(dnData.length);
      } else {
        recreateInstancedMesh(dnData.length);
      }
      recreateLineSegments(dnData.length);

      for (let i=startIndex; i<dnData.length; i++) {
        updateOneInstance(i, dnData[i]);
      }
      dnInstancedMesh.instanceMatrix.needsUpdate = true;
      dnInstancedMesh.instanceColor.needsUpdate = true;
      lineSegments.geometry.attributes.position.needsUpdate = true;
      recalcSceneCenter();
    }

    function createOrExpandInstancedMesh(newCount) {
      const baseDnGeom = new THREE.SphereGeometry(5,16,16);
      const dnMat = new THREE.MeshBasicMaterial({ color:0xffffff });
      dnInstancedMesh = new THREE.InstancedMesh(baseDnGeom, dnMat, newCount);
      dnInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      dnInstancedMesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(newCount*3),3
      );
      dnInstancedMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      scene.add(dnInstancedMesh);
    }

    function recreateInstancedMesh(newCount) {
      scene.remove(dnInstancedMesh);

      const baseDnGeom = new THREE.SphereGeometry(5,16,16);
      const dnMat = new THREE.MeshBasicMaterial({ color:0xffffff });
      const newMesh = new THREE.InstancedMesh(baseDnGeom, dnMat, newCount);
      newMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      newMesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(newCount*3),3
      );
      newMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

      if (dnInstancedMesh) {
        const oldCount = dnInstancedMesh.count;
        for (let i=0; i<oldCount; i++) {
          const tmpMat = new THREE.Matrix4();
          dnInstancedMesh.getMatrixAt(i, tmpMat);
          newMesh.setMatrixAt(i, tmpMat);

          const oldColor = new THREE.Color();
          dnInstancedMesh.getColorAt(i,oldColor);
          newMesh.setColorAt(i, oldColor);
        }
      }
      dnInstancedMesh = newMesh;
      scene.add(dnInstancedMesh);
    }

    function recreateLineSegments(newCount) {
      if (lineSegments) scene.remove(lineSegments);
      const lineGeo = new THREE.BufferGeometry();
      linePositions = new Float32Array(newCount*2*3);

      const filamentMat = new THREE.LineBasicMaterial({
        color:"#808080", opacity:0.5, transparent:true
      });
      lineSegments = new THREE.LineSegments(lineGeo, filamentMat);
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions,3));
      scene.add(lineSegments);
    }

    function updateOneInstance(i, dn) {
      const tmpMatrix = new THREE.Matrix4();
      tmpMatrix.makeTranslation(dn.position.x, dn.position.y, dn.position.z);
      dnInstancedMesh.setMatrixAt(i, tmpMatrix);

      // If it's .gif or isVideo => lighter color
      if (dn.redditData.isGif || dn.isVideo) {
        dnInstancedMesh.setColorAt(i, new THREE.Color("#E0E0E0"));
      } else {
        dnInstancedMesh.setColorAt(i, new THREE.Color("#BFBFBF"));
      }

      const arrOffset = i*6;
      linePositions[arrOffset+0] = dn.position.x;
      linePositions[arrOffset+1] = dn.position.y;
      linePositions[arrOffset+2] = dn.position.z;
      linePositions[arrOffset+3] = dn.position.x;
      linePositions[arrOffset+4] = dn.position.y;
      linePositions[arrOffset+5] = dn.position.z;
    }

    function recalcSceneCenter() {
      const total = new THREE.Vector3(0,0,0);
      let aliveCount = 0;
      dnData.forEach(d => {
        if (d.alive) {
          total.add(d.position);
          aliveCount++;
        }
      });
      if (aliveCount>0) {
        sceneCenter.copy(total).multiplyScalar(1/aliveCount);
      }
    }

    // Main animation loop
    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (!isPaused) {
        applyForces();
        timeSinceAbsorption += dt;
        if (timeSinceAbsorption >= ABSORPTION_INTERVAL) {
          timeSinceAbsorption = 0;
          timeBasedAbsorption();
        }
      }
      updateCamera();
      renderer.render(scene, camera);
    }

    function applyForces() {
      const tmpMat = new THREE.Matrix4();
      for (let i=0; i<dnData.length; i++) {
        const dn = dnData[i];
        if (!dn.alive) continue;

        let totalForce = new THREE.Vector3(0,0,0);
        let velocityBoost = new THREE.Vector3(0,0,0);
        let strongestPMN = null;
        let maxPull = 0;

        pmnData.forEach(pmn => {
          const rVec = new THREE.Vector3().subVectors(pmn.mesh.position,dn.position);
          const L = rVec.length()+5;
          const forceMag = (1*dn.mass*pmn.mass)/(L*L);
          if (forceMag>maxPull) {
            maxPull = forceMag;
            strongestPMN = pmn;
          }
          rVec.normalize();
          totalForce.add(rVec.multiplyScalar(forceMag));

          if (L<50) {
            const boostMag = (1*10)/(L*L);
            velocityBoost.add(rVec.clone().multiplyScalar(boostMag*0.05));
          }
        });

        if (totalForce.length()>15) {
          totalForce.normalize().multiplyScalar(15);
        }
        dn.velocity.add(totalForce).add(velocityBoost);
        dn.position.add(dn.velocity);
        dn.velocity.multiplyScalar(0.998);

        if (dn.velocity.length()>20) {
          dn.velocity.normalize().multiplyScalar(20);
        }

        // boundaries
        if (dn.position.x>boundaryX) {
          dn.position.x=boundaryX; dn.velocity.x*=-1;
        } else if (dn.position.x<0) {
          dn.position.x=0; dn.velocity.x*=-1;
        }
        if (dn.position.y>boundaryY) {
          dn.position.y=boundaryY; dn.velocity.y*=-1;
        } else if (dn.position.y<0) {
          dn.position.y=0; dn.velocity.y*=-1;
        }
        if (dn.position.z>boundaryZ) {
          dn.position.z=boundaryZ; dn.velocity.z*=-1;
        } else if (dn.position.z<0) {
          dn.position.z=0; dn.velocity.z*=-1;
        }

        tmpMat.makeTranslation(dn.position.x,dn.position.y,dn.position.z);
        dnInstancedMesh.setMatrixAt(i,tmpMat);

        if (strongestPMN) {
          const arrOffset = i*6;
          linePositions[arrOffset+0] = dn.position.x;
          linePositions[arrOffset+1] = dn.position.y;
          linePositions[arrOffset+2] = dn.position.z;
          linePositions[arrOffset+3] = strongestPMN.mesh.position.x;
          linePositions[arrOffset+4] = strongestPMN.mesh.position.y;
          linePositions[arrOffset+5] = strongestPMN.mesh.position.z;
        }
      }
      if (dnInstancedMesh) {
        dnInstancedMesh.instanceMatrix.needsUpdate = true;
        dnInstancedMesh.instanceColor.needsUpdate = true;
      }
      if (lineSegments) {
        lineSegments.geometry.attributes.position.needsUpdate = true;
      }
    }

    function updateCamera() {
      const t = clock.getElapsedTime();
      const xOrbit = orbitRadius*Math.sin(orbitPolar)*Math.cos(orbitAzimuth);
      const yOrbit = orbitRadius*Math.cos(orbitPolar);
      const zOrbit = orbitRadius*Math.sin(orbitPolar)*Math.sin(orbitAzimuth);

      const swayX = amplitude.x*Math.sin(t*0.2);
      const swayY = amplitude.y*Math.cos(t*0.17);
      const swayZ = amplitude.z*Math.sin(t*0.23);

      camera.position.set(
        sceneCenter.x + xOrbit + swayX,
        sceneCenter.y + yOrbit + swayY,
        sceneCenter.z + zOrbit + swayZ
      );
      camera.lookAt(sceneCenter);
    }

    function timeBasedAbsorption() {
      // 1) Pick a random PMN
      const randomIndex = Math.floor(Math.random() * pmnData.length);
      const pmn = pmnData[randomIndex];

      // 2) Find the nearest DN to that one PMN
      let closestIdx = -1;
      let minDist = Infinity;
      for (let i = 0; i < dnData.length; i++) {
        const dn = dnData[i];
        if (!dn.alive) continue;
        const dist = pmn.mesh.position.distanceTo(dn.position);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }

      // 3) If we found something, absorb it
      if (closestIdx >= 0) {
        absorbDn(closestIdx);
      }
    }

    function absorbDn(dnIndex) {
      const absorbedDn = dnData[dnIndex];
      absorbedDn.alive = false;

      // Hide DN
      const zeroMatrix = new THREE.Matrix4();
      dnInstancedMesh.setMatrixAt(dnIndex, zeroMatrix);
      dnInstancedMesh.instanceMatrix.needsUpdate = true;

      // If not a gif => auto-open
      if (!absorbedDn.redditData.isGif) {
        const imageUrl = absorbedDn.redditData.thumbnailUrl || "";
        const postUrl = absorbedDn.redditData.permalink
          ? "https://www.reddit.com" + absorbedDn.redditData.permalink
          : "#";
        const postTitle = absorbedDn.redditData.title || "(unnamed)";
        const upvoteCount = absorbedDn.redditData.upvoteCount || 0;

        showAbsorbedMedia(
          imageUrl,
          absorbedDn.videoUrl,
          postUrl,
          postTitle,
          upvoteCount,
          absorbedDn.isVideo
        );
      } else {
        // If it's a GIF, we won't auto-open (following your logic),
        // but we *could* do something else here if desired.
      }

      // Remove line
      const idxLine = dnIndex * 6;
      linePositions[idxLine + 0] = -9999;
      linePositions[idxLine + 1] = -9999;
      linePositions[idxLine + 2] = -9999;
      linePositions[idxLine + 3] = -9999;
      linePositions[idxLine + 4] = -9999;
      linePositions[idxLine + 5] = -9999;
      lineSegments.geometry.attributes.position.needsUpdate = true;

      recalculateDnMasses(dnData.filter((d) => d.alive));

      // Keep track in history
      // Instead of unshift, we'll push so newest is at the end:
      const historyItem = {
        title: absorbedDn.redditData.title || "(unnamed)",
        postUrl: absorbedDn.redditData.permalink
          ? "https://www.reddit.com" + absorbedDn.redditData.permalink
          : "#",
        thumbnailUrl: absorbedDn.redditData.thumbnailUrl || "",
        videoUrl: absorbedDn.videoUrl || "",
        isVideo: absorbedDn.isVideo,
        upvoteCount: absorbedDn.redditData.upvoteCount || 0
      };
      absorbedHistory.push(historyItem);

      // Update our pointer to the newest item
      absorbedHistoryIndex = absorbedHistory.length - 1;

      updatePostListUI();
    }

    // Listen for "Threads" button => init
    const discoverBtnEl = document.getElementById("startButton");
    if(discoverBtnEl){
      discoverBtnEl.addEventListener("click",()=>{
        init(); 
        if(centerEl) centerEl.textContent = "";
        discoverBtnEl.disabled = true;
      });
    }

    // Attach the new event listeners to the <img> IDs:

    // 1) Play/Pause Icon
    const toggleIconEl = document.getElementById("togglePlayIcon");
    if (toggleIconEl) {
      toggleIconEl.addEventListener("click", () => {
        isPaused = !isPaused;

        // Swap the icon based on paused or not
        if (isPaused) {
          toggleIconEl.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/icons/fa-solid-play.png";
        } else {
          toggleIconEl.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/icons/fa-solid-pause.png";
        }
      });
    }

    // 2) Back icon
    const backIconEl = document.getElementById("backIcon");
    if (backIconEl) {
      backIconEl.addEventListener("click", () => {
        // your "back" logic here, e.g.:
        if (absorbedHistoryIndex > 0) {
          absorbedHistoryIndex--;
          showAbsorbedHistoryAtIndex(absorbedHistoryIndex);
        }
      });
    }

    // 3) Forward icon
    const forwardIconEl = document.getElementById("forwardIcon");
    if (forwardIconEl) {
      forwardIconEl.addEventListener("click", () => {
        // your "forward" logic, e.g. immediate absorption
        timeBasedAbsorption();
      });
    }

    // ... rest of your code (including showAbsorbedHistoryAtIndex, timeBasedAbsorption, etc.) ...
  })();
}

function launchGravitas(){
  createGravitasSimulation(document.body);
}
window.createGravitasSimulation = createGravitasSimulation;
