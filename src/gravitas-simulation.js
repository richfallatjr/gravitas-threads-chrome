import * as THREE from 'three';

export function createGravitasSimulation(parentEl) {

  // 1. DOM container creation
  const container = document.createElement("div");
  container.id = "simulation-container";
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "600px";
  container.style.margin = "0 auto";
  container.style.backgroundColor = "#F2F2F2";

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

  // Top center container (logo + discover button)
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

  const logo = document.createElement("img");
  logo.id = "logo";
  logo.src = "https://raw.githubusercontent.com/richfallatjr/gravitas/main/assets/gravitas-logo-solo.png";
  logo.alt = "Gravitas Logo";
  logo.style.height = "30px";
  logo.style.cursor = "pointer";
  logo.style.display = "inline-flex";
  logo.style.alignItems = "center";
  logo.style.justifyContent = "center";

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

  // NEW: Play/Pause button
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
  // We will attach its event listener below in the IIFE

  topCenterContainer.appendChild(logo);
  topCenterContainer.appendChild(discoverBtn);
  topCenterContainer.appendChild(togglePlayBtn);
  container.appendChild(topCenterContainer);

  // 2. "Post List" panel
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

  // Absorbed Image Container (512px wide)
  const absorbedImageContainer = document.createElement("div");
  absorbedImageContainer.id = "absorbedImageContainer";
  absorbedImageContainer.style.position = "absolute";
  absorbedImageContainer.style.top = "50%";
  absorbedImageContainer.style.left = "50%";
  absorbedImageContainer.style.transform = "translate(-50%, -50%)";
  absorbedImageContainer.style.zIndex = "9999";
  absorbedImageContainer.style.display = "inline-block";
  absorbedImageContainer.style.minWidth = "512px";
  absorbedImageContainer.style.maxWidth = "512px";
  absorbedImageContainer.style.maxHeight = "512px";
  absorbedImageContainer.style.overflow = "hidden";

  const absorbedImageLink = document.createElement("a");
  absorbedImageLink.id = "absorbedImageLink";
  absorbedImageLink.href = "#";
  absorbedImageLink.target = "_blank";
  absorbedImageLink.style.display = "block";
  absorbedImageLink.style.border = "2px solid rgba(255, 255, 255, 0)";
  absorbedImageLink.style.borderRadius = "4px";

  const absorbedImage = document.createElement("img");
  absorbedImage.id = "absorbedImage";
  absorbedImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="; // blank fallback
  absorbedImage.alt = "Reddit Preview Image";
  absorbedImage.style.display = "block";
  absorbedImage.style.width = "auto";
  absorbedImage.style.height = "auto";
  absorbedImage.style.minWidth = "512px";
  absorbedImage.style.maxWidth = "100%";
  absorbedImage.style.maxHeight = "100%";
  absorbedImage.style.objectFit = "contain";

  absorbedImageLink.appendChild(absorbedImage);
  absorbedImageContainer.appendChild(absorbedImageLink);
  document.body.appendChild(absorbedImageContainer);

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

  // Add container to DOM
  parentEl.appendChild(container);

  // For text override
  const centerEl = document.getElementById("centeredText");

  // =====================================
  //  IIFE to hold our logic
  // =====================================
  (function() {

    // --------------- NEW: We'll store multiple feed types. ---------------
    const FEED_TYPES = ["hot", "new", "top"];

    // We'll keep track of the last 10 absorbed posts
    const absorbedHistory = [];
    function updatePostListUI() {
      const panel = document.getElementById("postListPanel");
      panel.innerHTML = "";
      const heading = document.createElement("div");
      heading.textContent = "Last 10 Absorbed Posts:";
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

    const clickColors = ["#FF6188", "#A9DC76", "#FFD866", "#78DCE8", "#AB9DF2"];

    let dnInstancedMesh = null;
    let dnData = [];
    let queuedDNs = [];
    let lineSegments = null;
    let linePositions = null;
    let scene, camera, renderer;
    let allMeshes = [];
    let clock;
    let timeSinceAbsorption = 0;
    const ABSORPTION_INTERVAL = 1.0;

    const boundaryX = 700, boundaryY = 600, boundaryZ = 400;
    const G = 1;
    const softening = 5;
    const maxForce = 15;
    const maxVelocity = 20;

    let orbitAzimuth = 0;
    let orbitPolar = Math.PI * 0.5;
    let orbitRadius = 400;
    let sceneCenter = new THREE.Vector3();
    let amplitude = new THREE.Vector3(20, 20, 20);

    let isMouseDown = false;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const DRAG_THRESHOLD = 5;

    // NEW: isPaused toggles physics updates
    let isPaused = false;

    // 3 PMNs: upvoteFactor, commentFactor, newnessFactor
    const pmnMetrics = [
      { metric: "upvoteFactor",  mass: 20 },
      { metric: "commentFactor", mass: 12 },
      { metric: "newnessFactor", mass: 15 },
    ];
    let pmnData = pmnMetrics.map(m => ({
      mesh: null,
      type: "PMN",
      mass: m.mass,
      metric: m.metric,
      position: null
    }));

    // Handle orbit dragging
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

    // Show the big image in the center
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

    // Show the text details below the image
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

    // Clicking on a sphere
    function showClickedDnBriefly(dn, instanceId) {
      const title = dn.redditData?.title || "(untitled)";
      const postUrl = dn.redditData?.permalink
        ? "https://www.reddit.com" + dn.redditData.permalink
        : "#";
      const imageUrl = dn.redditData?.thumbnailUrl || "";
      const upvoteCount = dn.redditData?.upvoteCount || 0;
      showAbsorbedImage(imageUrl, postUrl, title, upvoteCount);

      const newColor = new THREE.Color(clickColors[Math.floor(Math.random() * clickColors.length)]);
      dnInstancedMesh.setColorAt(instanceId, newColor);
      dnInstancedMesh.instanceColor.needsUpdate = true;
    }

    // Mass logic
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

    // Fetch multiple feeds from subreddit
    async function fetchAllRedditThreads() {
      const sub = getCurrentSubredditFromUrl() || "popular";
      console.log("[fetchAllRedditThreads] Using multiple feed types for r/", sub);

      // 1) Fetch each feed type (hot, new, top)
      let allPosts = [];
      for (const type of FEED_TYPES) {
        const postsForType = await fetchRedditDataViaApi(sub, type);
        allPosts = allPosts.concat(postsForType);
      }

      // 2) Remove duplicates by post permalink or id
      const uniqueMap = new Map();
      for (let p of allPosts) {
        // Use permalink as the unique key
        uniqueMap.set(p.permalink, p);
      }
      const uniquePosts = Array.from(uniqueMap.values());
      return uniquePosts;
    }

    function getCurrentSubredditFromUrl() {
      const currentUrl = window.location.href;
      const match = currentUrl.match(/reddit\.com\/r\/([^/]+)/);
      if (match && match[1]) return match[1];
      return "popular";
    }

    async function fetchRedditDataViaApi(subreddit, feedType = "hot") {
      const url = `https://www.reddit.com/r/${subreddit}/${feedType}.json?limit=100`;
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Reddit API error: ${resp.statusText}`);
      }
      const json = await resp.json();
      const rawPosts = json.data?.children || [];
      return rawPosts.map(p => mapRedditPostToSimple(p.data));
    }

    function mapRedditPostToSimple(postData) {
      return {
        title: postData.title || "Untitled",
        upvoteCount: postData.ups || 0,
        commentCount: postData.num_comments || 0,
        permalink: postData.permalink || "",
        thumbnailUrl: getHighResImageFromRedditPost(postData),
        createdAt: postData.created_utc ? (postData.created_utc * 1000) : Date.now()
      };
    }

    function getHighResImageFromRedditPost(d) {
      if (d.preview && d.preview.images && d.preview.images.length > 0) {
        const firstImage = d.preview.images[0];
        if (firstImage.source && firstImage.source.url) {
          return firstImage.source.url.replace(/&amp;/g, "&");
        }
      }
      if (d.thumbnail && d.thumbnail.startsWith("http")) {
        return d.thumbnail;
      }
      return "";
    }

    // Convert posts to DN objects
    function convertRedditPostsToDNs(posts) {
      const maxX = 700, maxY = 600, maxZ = 400;
      const now = Date.now();

      return posts.map(post => {
        const ageDays = (now - post.createdAt) / (1000 * 60 * 60 * 24);
        const maxDays = 365;
        const clamped = Math.min(ageDays, maxDays);
        const newnessFactor = 1 - (clamped / maxDays);

        const upvoteFactor = Math.min(post.upvoteCount / 5000, 1.0);
        const commentFactor = Math.min(post.commentCount / 500, 1.0);

        const dn = {
          redditData: {
            title: post.title,
            upvoteCount: post.upvoteCount,
            permalink: post.permalink,
            thumbnailUrl: post.thumbnailUrl
          },
          attributes: {
            upvoteFactor,
            commentFactor,
            newnessFactor
          },
          position: new THREE.Vector3(
            Math.random() * maxX,
            Math.random() * maxY,
            Math.random() * maxZ
          ),
          velocity: new THREE.Vector3(0, 0, 0),
          mass: 1,
          alive: true
        };
        dn.mass = calculateDnMass(dn);
        return dn;
      });
    }

    // For bigger visual effect, fill up to 1000 DN
    function scaleDNsTo1000(dnData) {
      if (!dnData.length) return dnData;
      const origCount = dnData.length;
      while (dnData.length < 1000) {
        const src = dnData[dnData.length % origCount];
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

    // init => fetch posts
    async function init() {
      const posts = await fetchAllRedditThreads();
      let rawDNs = convertRedditPostsToDNs(posts);
      if (rawDNs.length < 1000) {
        scaleDNsTo1000(rawDNs);
      }
      queuedDNs = rawDNs.slice();
      createEmptyScene();
      startQueueTimer();
    }

    function randomPmnPosition() {
      const x = 175 + Math.random() * 350;
      const y = 150 + Math.random() * 300;
      const z = 100 + Math.random() * 200;
      return [x, y, z];
    }

    function createEmptyScene() {
      const container = document.getElementById("simulation-container");
      if (!container) {
        console.warn("No simulation container found!");
        return;
      }

      scene = new THREE.Scene();
      scene.background = new THREE.Color("#F2F2F2");

      camera = new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        2000
      );
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      // Create PMNs
      pmnData.forEach(p => {
        p.position = randomPmnPosition();
      });
      const sphereGeom = new THREE.SphereGeometry(5, 16, 16);
      const pmnMat = new THREE.MeshBasicMaterial({ color: "#808080" });
      pmnData.forEach(p => {
        const mesh = new THREE.Mesh(sphereGeom, pmnMat);
        mesh.position.set(...p.position);
        scene.add(mesh);
        p.mesh = mesh;
        p.type = "PMN";
        allMeshes.push(p);
      });

      dnData = [];
      dnInstancedMesh = null; 
      linePositions = null;
      lineSegments = null;

      scene.add(new THREE.AmbientLight(0xffffff, 1));

      orbitAzimuth = 0;
      orbitPolar = Math.PI * 0.5;
      orbitRadius = 400;

      setupInteraction(container);
      clock = new THREE.Clock();
      animate();
    }

    // Queue logic
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
        const batch = queuedDNs.splice(0, BATCH_SIZE);
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

      for (let i = startIndex; i < dnData.length; i++) {
        updateOneInstance(i, dnData[i]);
      }
      dnInstancedMesh.instanceMatrix.needsUpdate = true;
      dnInstancedMesh.instanceColor.needsUpdate = true;
      lineSegments.geometry.attributes.position.needsUpdate = true;
      recalcSceneCenter();
    }

    function createOrExpandInstancedMesh(newCount) {
      const baseDnGeom = new THREE.SphereGeometry(5, 16, 16);
      const dnMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      dnInstancedMesh = new THREE.InstancedMesh(baseDnGeom, dnMat, newCount);
      dnInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      dnInstancedMesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(newCount * 3), 3
      );
      dnInstancedMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      scene.add(dnInstancedMesh);
    }

    function recreateInstancedMesh(newCount) {
      scene.remove(dnInstancedMesh);
      const baseDnGeom = new THREE.SphereGeometry(5, 16, 16);
      const dnMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const newMesh = new THREE.InstancedMesh(baseDnGeom, dnMat, newCount);
      newMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      newMesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(newCount * 3), 3
      );
      newMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

      if (dnInstancedMesh) {
        const oldCount = dnInstancedMesh.count;
        for (let i = 0; i < oldCount; i++) {
          const tmpMat = new THREE.Matrix4();
          dnInstancedMesh.getMatrixAt(i, tmpMat);
          newMesh.setMatrixAt(i, tmpMat);

          const oldColor = new THREE.Color();
          dnInstancedMesh.getColorAt(i, oldColor);
          newMesh.setColorAt(i, oldColor);
        }
      }
      dnInstancedMesh = newMesh;
      scene.add(dnInstancedMesh);
    }

    function recreateLineSegments(newCount) {
      if (lineSegments) scene.remove(lineSegments);
      const lineGeo = new THREE.BufferGeometry();
      linePositions = new Float32Array(newCount * 2 * 3);
      const filamentMat = new THREE.LineBasicMaterial({
        color: "#808080",
        opacity: 0.5,
        transparent: true
      });
      lineSegments = new THREE.LineSegments(lineGeo, filamentMat);
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      scene.add(lineSegments);
    }

    function updateOneInstance(i, dn) {
      const tmpMatrix = new THREE.Matrix4();
      tmpMatrix.makeTranslation(dn.position.x, dn.position.y, dn.position.z);
      dnInstancedMesh.setMatrixAt(i, tmpMatrix);
      dnInstancedMesh.setColorAt(i, new THREE.Color("#BFBFBF"));

      const arrOffset = i * 6;
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
      if (aliveCount > 0) {
        sceneCenter.copy(total).multiplyScalar(1 / aliveCount);
      }
    }

    // The main animation loop
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
      // We always update camera & render, so user can orbit even if paused
      updateCamera();
      renderer.render(scene, camera);
    }

    // Absorption (pulled to PMN)
    function timeBasedAbsorption() {
      pmnData.forEach(pmn => {
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
        if (closestIdx >= 0) {
          const absorbedDn = dnData[closestIdx];
          absorbedDn.alive = false;
          const zeroMatrix = new THREE.Matrix4();
          dnInstancedMesh.setMatrixAt(closestIdx, zeroMatrix);
          dnInstancedMesh.instanceMatrix.needsUpdate = true;

          const imageUrl = absorbedDn.redditData.thumbnailUrl || "";
          const postUrl = absorbedDn.redditData.permalink
            ? "https://www.reddit.com" + absorbedDn.redditData.permalink
            : "#";
          const postTitle = absorbedDn.redditData.title || "(unnamed)";
          const upvoteCount = absorbedDn.redditData.upvoteCount || 0;
          showAbsorbedImage(imageUrl, postUrl, postTitle, upvoteCount);

          const idxLine = closestIdx * 6;
          linePositions[idxLine+0] = -9999;
          linePositions[idxLine+1] = -9999;
          linePositions[idxLine+2] = -9999;
          linePositions[idxLine+3] = -9999;
          linePositions[idxLine+4] = -9999;
          linePositions[idxLine+5] = -9999;
          lineSegments.geometry.attributes.position.needsUpdate = true;

          recalculateDnMasses(dnData.filter(d => d.alive));

          // Push the new post to absorbedHistory, keep last 10, update UI
          absorbedHistory.unshift({ title: postTitle, postUrl });
          if (absorbedHistory.length > 10) {
            absorbedHistory.pop();
          }
          updatePostListUI();
        }
      });
    }

    // Apply the gravity-like forces
    function applyForces() {
      const tmpMat = new THREE.Matrix4();
      for (let i = 0; i < dnData.length; i++) {
        const dn = dnData[i];
        if (!dn.alive) continue;

        let totalForce = new THREE.Vector3(0,0,0);
        let velocityBoost = new THREE.Vector3(0,0,0);
        let strongestPMN = null;
        let maxPull = 0;

        pmnData.forEach(pmn => {
          const rVec = new THREE.Vector3().subVectors(pmn.mesh.position, dn.position);
          const L = rVec.length() + softening;
          const forceMag = (1 * dn.mass * pmn.mass) / (L * L);
          if (forceMag > maxPull) {
            maxPull = forceMag;
            strongestPMN = pmn;
          }
          rVec.normalize();
          totalForce.add(rVec.multiplyScalar(forceMag));

          if (L < 50) {
            const boostMag = (1*10)/(L*L);
            velocityBoost.add(rVec.clone().multiplyScalar(boostMag*0.05));
          }
        });

        if (totalForce.length() > maxForce) {
          totalForce.normalize().multiplyScalar(maxForce);
        }

        dn.velocity.add(totalForce).add(velocityBoost);
        dn.position.add(dn.velocity);
        dn.velocity.multiplyScalar(0.998);

        if (dn.velocity.length() > maxVelocity) {
          dn.velocity.normalize().multiplyScalar(maxVelocity);
        }

        // Boundaries
        if (dn.position.x > boundaryX) {
          dn.position.x = boundaryX; dn.velocity.x *= -1;
        } else if (dn.position.x < 0) {
          dn.position.x = 0; dn.velocity.x *= -1;
        }
        if (dn.position.y > boundaryY) {
          dn.position.y = boundaryY; dn.velocity.y *= -1;
        } else if (dn.position.y < 0) {
          dn.position.y = 0; dn.velocity.y *= -1;
        }
        if (dn.position.z > boundaryZ) {
          dn.position.z = boundaryZ; dn.velocity.z *= -1;
        } else if (dn.position.z < 0) {
          dn.position.z = 0; dn.velocity.z *= -1;
        }

        tmpMat.makeTranslation(dn.position.x, dn.position.y, dn.position.z);
        dnInstancedMesh.setMatrixAt(i, tmpMat);

        if (strongestPMN) {
          const arrOffset = i * 6;
          linePositions[arrOffset + 0] = dn.position.x;
          linePositions[arrOffset + 1] = dn.position.y;
          linePositions[arrOffset + 2] = dn.position.z;
          linePositions[arrOffset + 3] = strongestPMN.mesh.position.x;
          linePositions[arrOffset + 4] = strongestPMN.mesh.position.y;
          linePositions[arrOffset + 5] = strongestPMN.mesh.position.z;
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

    // Move the camera around the center
    function updateCamera() {
      const t = clock.getElapsedTime();
      const xOrbit = orbitRadius * Math.sin(orbitPolar) * Math.cos(orbitAzimuth);
      const yOrbit = orbitRadius * Math.cos(orbitPolar);
      const zOrbit = orbitRadius * Math.sin(orbitPolar) * Math.sin(orbitAzimuth);

      const swayX = amplitude.x * Math.sin(t * 0.2);
      const swayY = amplitude.y * Math.cos(t * 0.17);
      const swayZ = amplitude.z * Math.sin(t * 0.23);

      camera.position.set(
        sceneCenter.x + xOrbit + swayX,
        sceneCenter.y + yOrbit + swayY,
        sceneCenter.z + zOrbit + swayZ
      );
      camera.lookAt(sceneCenter);
    }

    // Listen for "Threads" button => init
    if (discoverBtn) {
      discoverBtn.addEventListener("click", () => {
        init().catch(err => {
          console.error("Error fetching reddit threads:", err.message);
          if (centerEl) {
            centerEl.textContent = "Unable to fetch Reddit data. Sorry.";
          }
        });
        if (centerEl) {
          centerEl.textContent = "";
        }
        discoverBtn.disabled = true;
      });
    }

    // NEW: Listen for play/pause toggle
    if (togglePlayBtn) {
      togglePlayBtn.addEventListener("click", () => {
        isPaused = !isPaused;
        togglePlayBtn.textContent = isPaused ? "Play" : "Pause";
      });
    }

  })(); // end IIFE
}

function launchGravitas() {
  createGravitasSimulation(document.body);
}
window.createGravitasSimulation = createGravitasSimulation;
