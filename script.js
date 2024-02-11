$(document).ready(function () {

    $("#orderValueSlider").val($("#orderValueSlider").attr("min"));

    //Task 1
    //Implement the Add Order. When the button is clicked, add a new row in the top of the table,
    //with each column showing a text box where data can be entered. Show a button
    //called "Add" under "Action" column.Once all data is entered and "Add" button pressed, the data should be displayed as labelled data in the row.
    $("#addOrderBtn").click(function () {
        // Create a new row with input fields
        var newRow = $("<tr>").append(
            $("<td>").append($("<input>").attr("type", "text").addClass("form-control")),
            $("<td>").append($("<input>").attr("type", "text").addClass("form-control")),
            $("<td>").append($("<input>").attr("type", "text").addClass("form-control")),
            $("<td>").append(
                $("<button>").text("Add").addClass("btn btn-sm btn-success").click(function () {
                    // Get the entered data
                    var orderId = newRow.find("td:nth-child(1) input").val();
                    var orderValue = newRow.find("td:nth-child(2) input").val();
                    var orderQuantity = newRow.find("td:nth-child(3) input").val();

                    // Validate input
                    if (orderId && orderValue && orderQuantity) {
                        // Add data to the new row
                        newRow.html(`
                      <td>${orderId}</td>
                      <td>${orderValue}</td>
                      <td>${orderQuantity}</td>
                      <td>
                        <button class="btn btn-sm btn-primary">Edit</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                      </td>
                    `);

                        // Insert the new row at the top of the table
                        $("#orderTableBody").prepend(newRow);
                    } else {
                        alert("Invalid input.");
                    }
                })
            )
        );

        $("#orderTableBody").prepend(newRow);
    });

    //Task 2
    //Implement the "Filter Orders". On selecting the slider, the table should be updated to show only the orders that are more than the order value
    //Function to filter orders based on order value
    function filterOrders(orderValue) {
        // Show all rows initially
        $("#orderTableBody tr").show();

        // Hide rows with order value less than the specified value
        $("#orderTableBody tr").each(function () {
            var rowOrderValue = parseInt($(this).find("td:nth-child(2)").text().replace('$', ''));
            if (rowOrderValue < orderValue) {
                $(this).hide();
            }
        });
    }

    // Initial filter based on slider value
    filterOrders($("#orderValueSlider").val());
    // Slider change event handler
    $("#orderValueSlider").change(function () {
        var sliderValue = parseInt($(this).val());
        filterOrders(sliderValue);
    });

    //Task 3
    //Implement "Save" feature. Once clicked. all the data should be stored in the "Local" storage of the browser.
    // The data should be stored in JSON format
    // Save Data button click event handler
    $("#saveDataBtn").click(function () {
        // Get data from the table and convert it to an array of objects
        var ordersData = [];
        $("#orderTableBody tr").each(function () {
            var orderObject = {
                orderId: $(this).find("td:nth-child(1)").text(),
                orderValue: $(this).find("td:nth-child(2)").text(),
                orderQuantity: $(this).find("td:nth-child(3)").text()
            };
            ordersData.push(orderObject);
        });

        // Convert the array to a JSON string and store it in local storage
        localStorage.setItem("ordersData", JSON.stringify(ordersData));

        alert("Data saved successfully!");
    });

    //Task 4
    // Edit button click event handler
    // Implement the Edit order. On clicking, show the data in the row in text input so that changes can be done.
    // The "Action" column should show "Save" button. On clicking the updated data should be saved
    $("#orderTableBody").on("click", ".btn-edit", function () {
        // Get the current row
        var currentRow = $(this).closest("tr");

        // Save existing order details
        var orderId = currentRow.find("td:nth-child(1)").text();
        var orderValue = currentRow.find("td:nth-child(2)").text().replace('$', '');
        var orderQuantity = currentRow.find("td:nth-child(3)").text();

        // Replace order details with text inputs
        currentRow.find("td:not(:last-child)").each(function () {
            var index = $(this).index() + 1;
            var inputValue = (index === 1) ? orderId : (index === 2) ? orderValue : orderQuantity;
            $(this).html(`<input type='text' class='form-control' value='${inputValue}'>`);
        });

        // Change Action button to Save button
        currentRow.find(".btn-edit").removeClass("btn-primary").addClass("btn-success").text("Save").removeClass("btn-edit").addClass("btn-save");
    });

    // Save button click event handler (for edited row)
    $("#orderTableBody").on("click", ".btn-save", function () {
        // Get the current row
        var currentRow = $(this).closest("tr");

        // Get edited values from text inputs
        var editedOrderId = currentRow.find("td:nth-child(1) input").val();
        var editedOrderValue = currentRow.find("td:nth-child(2) input").val();
        var editedOrderQuantity = currentRow.find("td:nth-child(3) input").val();

        // Update the row with edited data
        currentRow.html(`
                    <td>${editedOrderId}</td>
                    <td>$${editedOrderValue}</td>
                    <td>${editedOrderQuantity}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-edit">Edit</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </td>
                `);

        // Change Save button back to Edit button
        currentRow.find(".btn-save").removeClass("btn-success").addClass("btn-primary").text("Edit").removeClass("btn-save").addClass("btn-edit");
    });

    //Task 5
    // Delete button click event handler
    // Implement "Delete" button to delete the data from local strorage and also remove the row from table
    $("#orderTableBody").on("click", ".btn-delete", function () {
        // Get the current row
        var currentRow = $(this).closest("tr");

        // Get the order ID or any unique identifier for the row
        var orderId = currentRow.find("td:nth-child(1)").text();

        // Your logic to delete data from local storage (replace with actual local storage key)
        var localStorageKey = "ordersData";
        var orders = JSON.parse(localStorage.getItem(localStorageKey)) || [];

        // Find the index of the order in the array
        var index = orders.findIndex(function (order) {
            return order.orderId === orderId;
        });

        // Remove the order from the array
        if (index !== -1) {
            orders.splice(index, 1);
            // Save the updated array back to local storage
            localStorage.setItem(localStorageKey, JSON.stringify(orders));
        }

        // Remove the row from the table
        currentRow.remove();
    });

    //Task 6
    //Implement "Search" to lookup entered text in Order ID and just list the row that matches the order ID
    // Search Orders input keyup event handler
    $("#searchOrdersInput").keyup(function () {
        var searchText = $(this).val().toLowerCase();
        $("#orderTableBody tr").hide();
        $("#orderTableBody tr:contains('" + searchText + "')").show();
    });

    // Custom :contains() selector for case-insensitive search
    /*jQuery.expr[":"].contains = jQuery.expr.createPseudo(function (arg) {
        return function (elem) {
            return jQuery(elem).text().toLowerCase().indexOf(arg.toLowerCase()) >= 0;
        };
    });*/
});

