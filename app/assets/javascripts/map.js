let map;
let currentMarker = null;
let directionsService;
let directionsRenderer;
let userLocationMarker = null;

// Initialize map
function initMap() {
  const center = { lat: 21.0285, lng: 105.8542 }; // Hà Nội (hoặc vị trí mặc định)
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 12,
  });

  // Initialize Directions API
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Thêm search box để tìm kiếm địa điểm
  addSearchBox();

  // Hiển thị vị trí hiện tại của người dùng
  showUserLocation();
}

// Hiển thị vị trí hiện tại của người dùng
function showUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userLocation = { lat: userLat, lng: userLng };

        // Tạo một marker cho vị trí hiện tại
        if (userLocationMarker) {
          userLocationMarker.setMap(null); // Xóa marker cũ
        }
        userLocationMarker = new google.maps.Marker({
          map: map,
          position: userLocation,
          title: "Your Current Location",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Icon màu xanh cho vị trí người dùng
        });

        // Tập trung bản đồ vào vị trí người dùng
        map.setCenter(userLocation);
      },
      () => {
        alert("Geolocation failed or is not supported by this browser.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Thêm thanh tìm kiếm địa điểm
function addSearchBox() {
  const input = document.getElementById("search-box");
  const searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    // Lấy địa điểm đầu tiên từ kết quả tìm kiếm
    const place = places[0];
    if (!place.geometry || !place.geometry.location) return;

    // Tạo marker cho địa điểm
    if (currentMarker) {
      currentMarker.setMap(null); // Xóa marker trước đó
    }
    currentMarker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
    });

    map.setCenter(place.geometry.location);

    // Cập nhật thông tin cho địa điểm được chọn
    updateLocationInfo({
      title: place.name || "Unknown",
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      description: place.formatted_address || "No description available.",
      restaurantName: "Restaurant Name: Example", // Dữ liệu mẫu
      mainDish: "Main Dish: Pho", // Dữ liệu mẫu
      backgroundImage: "background-image-url-here.jpg", // Dữ liệu mẫu
    });

    // Hiển thị form nhập thông tin
    document.getElementById("info-form-container").style.display = "block";
  });
}

// Cập nhật thông tin địa điểm vào sidebar
function updateLocationInfo(info) {
  // Cập nhật thông tin hiển thị trong sidebar
  document.getElementById("info-title").innerText = `Title: ${info.title}`;
  document.getElementById(
    "info-coordinates"
  ).innerText = `Coordinates: ${info.coordinates.lat}, ${info.coordinates.lng}`;
  document.getElementById(
    "info-description"
  ).innerText = `Description: ${info.description}`;
  document.getElementById(
    "info-restaurant-name"
  ).innerText = `Restaurant: ${info.restaurantName}`;
  document.getElementById(
    "info-main-dish"
  ).innerText = `Main Dish: ${info.mainDish}`;
  document.getElementById(
    "info-background"
  ).innerText = `Background Image: ${info.backgroundImage}`;

  // Cập nhật trường nhập liệu để người dùng có thể chỉnh sửa
  document.getElementById("restaurant-name").value = info.restaurantName;
  document.getElementById("main-dish").value = info.mainDish;
  document.getElementById("background-image").value = info.backgroundImage;

  // Hiển thị thông tin trong InfoWindow
  if (currentMarker) {
    const infoWindow = new google.maps.InfoWindow({
      content: `<h4>${info.restaurantName}</h4><p>Main Dish: ${info.mainDish}</p><img src="${info.backgroundImage}" alt="Background Image" style="width: 100%; height: auto;"/>`,
    });
    infoWindow.open(map, currentMarker);
  }
}

// Cập nhật thông tin khi người dùng nhấn "Update Location Info"
function handleUpdateInfo() {
  const restaurantName = document.getElementById("restaurant-name").value;
  const mainDish = document.getElementById("main-dish").value;
  const backgroundImage = document.getElementById("background-image").value;

  // Cập nhật thông tin trong sidebar và marker
  if (currentMarker) {
    const info = {
      restaurantName: restaurantName,
      mainDish: mainDish,
      backgroundImage: backgroundImage,
    };
    updateLocationInfo(info);
  }
}

// Clear the route on the map
function clearRoute() {
  directionsRenderer.setDirections({ routes: [] });
}

window.initMap = initMap;
