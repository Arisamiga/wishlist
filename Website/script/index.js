document.getElementById("sort").addEventListener("change", function() {
    var sort = document.getElementById("sort").value;
    var items = document.querySelectorAll('.wishlist-item');
    var itemsArray = Array.prototype.slice.call(items, 0);
    var wishlist = document.querySelector('.wishlist');

    // Apply fade-out animation to all items
    itemsArray.forEach(item => item.classList.add('fade-out'));

    setTimeout(() => {
        if (sort == "price") {
            itemsArray.sort(function(a, b) {
                var aPrice = parseFloat(a.querySelector('.item-price').textContent.replace("€", ""));
                var bPrice = parseFloat(b.querySelector('.item-price').textContent.replace("€", ""));
                return aPrice - bPrice;
            });
        } else if (sort == "name") {
            itemsArray.sort(function(a, b) {
                var aName = a.querySelector('.item-name').textContent;
                var bName = b.querySelector('.item-name').textContent;
                return aName.localeCompare(bName);
            });
        }

        wishlist.innerHTML = "";

        itemsArray.forEach(item => {
            item.classList.remove('fade-out');
            item.classList.add('fade-in');
            wishlist.appendChild(item);
        });

        setTimeout(() => {
            itemsArray.forEach(item => item.classList.remove('fade-in'));
        }, 500); // Match the timeout with the animation duration
    }, 500); // Match the timeout with the animation duration
});