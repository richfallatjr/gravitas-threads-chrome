/************************************************************
 * Full Gravitas (Large, Merged Version)
 * - Subreddit + user path detection
 * - FEED_TYPES = ["hot", "new", "top", "topYear"]
 * - Skip auto-absorption for GIF
 * - Mark GIF spheres lighter
 * - Show info pane for everything else on auto-absorb
 * - On click, always show the info pane (even GIF)
 * - Queue-based insertion, multiple PMNs, pause/play
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
  container.style.height = "600px";
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

  // Top center container (logo + discover button + pause btn)
  const topCenterContainer = document.createElement("div");
  topCenterContainer.id = "top-center-container";
  topCenterContainer.style.position = "absolute";
  topCenterContainer.style.top = "10px";
  topCenterContainer.style.left = "50%";
  topCenterContainer.style.transform = "translateX(-50%)";
  topCenterContainer.style.zIndex = "9999";
  topCenterContainer.style.display = "flex";
  topCenterContainer.style.alignItems = "center";
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

  // Play/Pause Button
  const togglePlayBtn = document.createElement("button");
  togglePlayBtn.id = "togglePlayButton";
  togglePlayBtn.textContent = "Pause";
  togglePlayBtn.style.padding = "10px 20px";
  togglePlayBtn.style.backgroundColor = "#FFFFFF";
  togglePlayBtn.style.border = "none";
  togglePlayBtn.style.borderRadius = "4px";
  togglePlayBtn.style.cursor = "pointer";
  togglePlayBtn.style.color = "black";
  togglePlayBtn.style.display = "inline-flex";
  togglePlayBtn.style.alignItems = "center";
  togglePlayBtn.style.justifyContent = "center";
  togglePlayBtn.style.userSelect = "none";
  togglePlayBtn.style.webkitUserSelect = "none";
  togglePlayBtn.style.msUserSelect = "none";
  togglePlayBtn.style.MozUserSelect = "none";
  // We will attach its event listener below in the IIFE

  topCenterContainer.appendChild(logo);
  topCenterContainer.appendChild(discoverBtn);
  topCenterContainer.appendChild(togglePlayBtn);
  container.appendChild(topCenterContainer);

  // "Post List" panel
  const postListPanel = document.createElement("div");
  postListPanel.id = "postListPanel";
  postListPanel.style.position = "absolute";
  postListPanel.style.right = "20px";
  postListPanel.style.bottom = "20px";
  postListPanel.style.width = "200px";
  postListPanel.style.maxHeight = "500px";
  postListPanel.style.overflowY = "auto";
  postListPanel.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  postListPanel.style.padding = "10px";
  postListPanel.style.borderRadius = "4px";
  postListPanel.style.fontSize = "13px";
  postListPanel.style.pointerEvents = "auto";
  postListPanel.style.display = "none";
  postListPanel.style.color = "#000";
  postListPanel.style.zIndex = "9999";
  container.appendChild(postListPanel);
  postListPanel.style.userSelect = "none";
  postListPanel.style.webkitUserSelect = "none";
  postListPanel.style.msUserSelect = "none";
  postListPanel.style.MozUserSelect = "none";

  // Absorbed Image Container (simple)
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
  absorbedImageContainer.style.maxHeight = "480px";
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
  absorbedImageLink.setAttribute("draggable", "false");

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
  absorbedImage.setAttribute("draggable", "false");

  
  absorbedImage.addEventListener("dragstart", (e) => e.preventDefault());
  absorbedImageLink.addEventListener("dragstart", (e) => e.preventDefault());

  absorbedImageLink.appendChild(absorbedImage);
  absorbedImageContainer.appendChild(absorbedImageLink);
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
    const ABSORPTION_INTERVAL = 2.0;

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

    let isPaused = false; // for play/pause
    // We'll store multiple feed types
    const FEED_TYPES = ["hot", "new", "top", "topYear"];
    let absorbedHistory = [];

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

    // Colors for click
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

      absorbedHistory.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.postUrl || "#";
        link.target = "_blank";
        link.textContent = item.title || "(untitled)";
        link.style.display = "block";
        link.style.marginBottom = "4px";
        link.style.textDecoration = "none";
        link.style.color = "#0077cc";
        panel.appendChild(link);
      });

      if (absorbedHistory.length > 0) {
        panel.style.display = "block";
      } else {
        panel.style.display = "none";
      }
    }

    /************************************************************
     * HELPER: Absorbed Image
     ************************************************************/
    function showAbsorbedImage(imageUrl, redditUrl, postTitle, upvoteCount) {
      const container = document.getElementById("absorbedImageContainer");
      const link = document.getElementById("absorbedImageLink");
      const img = document.getElementById("absorbedImage");

      if (link) link.href = redditUrl || "#";
      if (img) {
        img.src = imageUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        img.onload = () => {
          if (container) container.style.display = "block";
          showDetailsPane(postTitle, upvoteCount);
        };
        img.onerror = () => {
          if (container) container.style.display = "block";
          showDetailsPane(postTitle, upvoteCount);
        };
      }
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
     * Clicking a sphere
     ************************************************************/
    function showClickedDnBriefly(dn, instanceId) {
      const title = dn.redditData?.title || "(untitled)";
      const postUrl = dn.redditData?.permalink
        ? "https://www.reddit.com" + dn.redditData.permalink
        : "#";
      const imageUrl = dn.redditData?.thumbnailUrl || "";
      const upvoteCount = dn.redditData?.upvoteCount || 0;

      // Always show the image/gif if user clicks
      showAbsorbedImage(imageUrl, postUrl, title, upvoteCount);

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

    function isPostActuallyAGif(postData) {
      // 1) Check if domain is redgifs
      if (postData.domain === "redgifs.com") {
        return true;
      }
      // 2) Or if secure_media has .type === "redgifs.com"
      if (
        postData.secure_media &&
        postData.secure_media.type === "redgifs.com"
      ) {
        return true;
      }
      // 3) Or if media_embed.content has "redgifs.com/ifr"
      if (
        postData.media_embed &&
        typeof postData.media_embed.content === "string" &&
        postData.media_embed.content.includes("redgifs.com/ifr")
      ) {
        return true;
      }
    
      // 4) Otherwise, check if thumbnailUrl ends with .gif
      // (for real .gif links)
      // e.g. your existing logic
      if (postData.thumbnailUrl && postData.thumbnailUrl.toLowerCase().endsWith(".gif")) {
        return true;
      }
    
      return false;
    }
    

    function mapRedditPostToSimple(postData) {
      // check if it's a reddit video
      const isActuallyAGif = isPostActuallyAGif(postData);
      const isVideoPost = postData.is_video &&
                          postData.media &&
                          postData.media.reddit_video &&
                          postData.media.reddit_video.fallback_url;

      if (isVideoPost) {
        // treat it as mp4
        return {
          title: postData.title || "Untitled",
          upvoteCount: postData.ups || 0,
          commentCount: postData.num_comments || 0,
          permalink: postData.permalink || "",
          createdAt: postData.created_utc ? (postData.created_utc * 1000) : Date.now(),

          isVideo: true,
          videoUrl: postData.media.reddit_video.fallback_url,
          thumbnailUrl: getHighResImageFromRedditPost(postData),
          isGif: isActuallyAGif
        };
      } else {
        // image/gif
        return {
          title: postData.title || "Untitled",
          upvoteCount: postData.ups || 0,
          commentCount: postData.num_comments || 0,
          permalink: postData.permalink || "",
          createdAt: postData.created_utc ? (postData.created_utc * 1000) : Date.now(),

          isVideo: false,
          videoUrl: "",
          thumbnailUrl: getHighResImageFromRedditPost(postData)
        };
      }
    }

    function getHighResImageFromRedditPost(d) {
      // if it ends with .gif
      if (d.url && d.url.endsWith(".gif")) {
        return d.url;
      }
      // check preview
      if (d.preview && d.preview.images && d.preview.images[0]) {
        const previewObj = d.preview.images[0];
        const variants = previewObj.variants;
        if (variants && variants.gif && variants.gif.source && variants.gif.source.url) {
          return variants.gif.source.url.replace(/&amp;/g, "&");
        }
      }
      // fallback
      if (d.preview && d.preview.images && d.preview.images.length>0) {
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
     * 3) Combined fetch logic: multiple feed
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
        const uniquePosts = Array.from(uniqueMap.values());
        return uniquePosts;
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

        // detect if .gif => skip auto absorption
        const isGif = post.thumbnailUrl.toLowerCase().endsWith(".gif");

        return {
          redditData: {
            title: post.title,
            upvoteCount: post.upvoteCount,
            permalink: post.permalink,
            thumbnailUrl: post.thumbnailUrl,
            isGif
          },
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
      while (dnData.length<1000) {
        const src = dnData[dnData.length%origCount];
        const clone = {
          redditData: { ...src.redditData },
          attributes: { ...src.attributes },
          position: new THREE.Vector3(
            Math.random()*700,
            Math.random()*600,
            Math.random()*400
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
        if (rawDNs.length<1000) {
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
        if (queuedDNs.length===0) {
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

      // If isGif => lighter color
      if (dn.redditData.isGif) {
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

    // ---------- The main animation loop ----------
    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (!isPaused) {
        applyForces();
        timeSinceAbsorption+=dt;
        if (timeSinceAbsorption>=ABSORPTION_INTERVAL) {
          timeSinceAbsorption=0;
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
      pmnData.forEach(pmn => {
        let closestIdx=-1;
        let minDist=Infinity;
        for (let i=0; i<dnData.length; i++){
          const dn=dnData[i];
          if(!dn.alive) continue;
          const dist = pmn.mesh.position.distanceTo(dn.position);
          if(dist<minDist){
            minDist=dist;
            closestIdx=i;
          }
        }
        if(closestIdx>=0){
          const absorbedDn=dnData[closestIdx];
          absorbedDn.alive=false;

          // Hide DN
          const zeroMatrix=new THREE.Matrix4();
          dnInstancedMesh.setMatrixAt(closestIdx,zeroMatrix);
          dnInstancedMesh.instanceMatrix.needsUpdate=true;

          const imageUrl=absorbedDn.redditData.thumbnailUrl || "";
          const postUrl=absorbedDn.redditData.permalink
            ? "https://www.reddit.com"+absorbedDn.redditData.permalink
            : "#";
          const postTitle=absorbedDn.redditData.title || "(unnamed)";
          const upvoteCount=absorbedDn.redditData.upvoteCount||0;

          // If it's a gif, skip auto-open
          if(!absorbedDn.redditData.isGif){
            showAbsorbedImage(imageUrl, postUrl, postTitle, upvoteCount);
          }

          // remove line
          const idxLine=closestIdx*6;
          linePositions[idxLine+0]=-9999;
          linePositions[idxLine+1]=-9999;
          linePositions[idxLine+2]=-9999;
          linePositions[idxLine+3]=-9999;
          linePositions[idxLine+4]=-9999;
          linePositions[idxLine+5]=-9999;
          lineSegments.geometry.attributes.position.needsUpdate=true;

          recalculateDnMasses(dnData.filter(d=>d.alive));

          // keep last 10
          absorbedHistory.unshift({ title: postTitle, postUrl });
          if(absorbedHistory.length>10){
            absorbedHistory.pop();
          }
          updatePostListUI();
        }
      });
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

    // Listen for play/pause
    const toggleEl = document.getElementById("togglePlayButton");
    if(toggleEl){
      toggleEl.addEventListener("click",()=>{
        isPaused=!isPaused;
        toggleEl.textContent=isPaused?"Play":"Pause";
      });
    }

  })(); // end IIFE
}

function launchGravitas(){
  createGravitasSimulation(document.body);
}
window.createGravitasSimulation = createGravitasSimulation;