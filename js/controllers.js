angular
	.module('groceryList', [
		'LocalStorageModule'
		])
	.service('mainModel', function($window) {
		var uid = 1;
		var cid = 1;
		var items = [];
		var cLabel = ['label-default', 'label-danger', 'label-success', 'label-primary', 'label-info', 'label-warning']
		var cList = [];

		this.createCategory = function(category, label) {
			if (cList.map(function(e) { return e.category; }).indexOf(category.category) > -1)	{ //.map is supported in all major browsers/IE9+ | Can create troubles with Older IE;
				alertShow(); // Pretty sure this isn't correct way to do things 
				} else if (category.category != null & category.category != '') {
					category.id = cid++;
					category.label = cLabel[label];
					cList.push(category);
				    $window.sessionStorage.setItem('cats', JSON.stringify(cList));
				}
		}
		this.setCategory = function (cat, label, id) {
			for (i in items) {
				if (items[i].id == id) {
					items[i].Category = cat.category;
					items[i].Label = label;
				    $window.sessionStorage.setItem('items', JSON.stringify(items));

				}
			}
		}
		this.addItem = function(item) {
			if (item.id == null & item.Name != null & item.Name != '')  {
				item.id = uid++;
				items.push(item);
			    $window.sessionStorage.setItem('items', JSON.stringify(items));
			} else {
				for (i in items) {
					if (items[i].id == item.id) {
						items[i] = item;
					}
				}
			}
		}
	    this.getData = function(){ // Function to Load Data from Session Storage
	 		var sStorage = sessionStorage.getItem('items');
	 		var kewl = $.parseJSON(sStorage)
		 	if (kewl != null) {	
		 		kewl.forEach(function(item) {
				item.id = uid++;
				items.push(item); 

		 		})
		 	}
	 		var cStorage = sessionStorage.getItem('cats');
	 		var catstor = $.parseJSON(cStorage)
		 	if (catstor != null) {	
		 		catstor.forEach(function(cat) {
				cat.id = uid++;
				cList.push(cat); 
		 		})
		 	}
	    }
	    this.deleteCategory = function(id) {
			for (i in cList) {
				if (cList[i].id == id) {
					var catname = cList[i].category;
					cList.splice(i, 1);
				for (i in items) {
					if (items[i].Category == catname) {
						items[i].Category = 'none';
						items[i].Label = cLabel[0]; 
					    $window.sessionStorage.setItem('items', JSON.stringify(items)); // Write Session (Possibly not too beautiful way to do it, but hey)

					}
				}
				    $window.sessionStorage.setItem('cats', JSON.stringify(cList)); // Write Session (Possibly not too beautiful way to do it, but hey)
				}
			}
		}
		this.deleteItem = function(id) {
			for (i in items) {
				if (items[i].id == id) {
					items.splice(i, 1);
				    $window.sessionStorage.setItem('items', JSON.stringify(items)); // Write Session (Possibly not too beautiful way to do it, but hey)
				}
			}
		}
		this.getCategories = function() {
			return cList;
		}
		this.getLabels = function () {
			return cLabel;
		}
		this.getItems = function() {
			//var storage = [];
			//$.each(sessionStorage, function(i, v){
	        //	json.push(angular.fromJson(v));
	      	//});
			return items;
		}
	})
	.controller('mainCtrl', function($scope, $window , mainModel) {

	    $scope.oldItems = mainModel.getData();
		$scope.items =  mainModel.getItems() ; 
		$scope.categories = mainModel.getCategories();
		$scope.labels = mainModel.getLabels();
		$scope.label = 0; //set default label

		$scope.getItemsInCategories = function (cat) {
			var items = mainModel.getItems();
			var output = [];
			for (i in items) {
				if (items[i].Category == cat) {
					output.push(items[i]);
				} 
			};
			$scope.filteredItems = output;
		}

		$scope.createItem = function () {
			var toPush = {
				'Name': $scope.newItem.Name,
				'Category':'none',
				'Label':'label-default'
			};
			mainModel.addItem(toPush);
			delete $scope.newItem.Name;
			//document.getElementById("newItem").reset();
		}
		$scope.delete = function (i, id) {
			if(i == 1) {
			mainModel.deleteItem(id);
			} else if ( i == 2) {
			mainModel.deleteCategory(id);
			}
		}
		$scope.setCategory = function (cat, label, id) {
			mainModel.setCategory(cat, label, id);
		}
		$scope.setLabel = function (x) { 
			$scope.label = x;
		}
		$scope.createCategory = function () {
			var toPush = {
				'category': $scope.newCategory.category
			};
			mainModel.createCategory(toPush, $scope.label);
			$scope.label = 0;
			delete $scope.newCategory.category;
		}
	});