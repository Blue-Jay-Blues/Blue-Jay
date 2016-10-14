var Tree = function (key, value, host) {
  this.host = host || this;
  this.key = key || '';
  this.value = value || 0;
  this.children = [];
};

Tree.prototype.add = function (key, value, callback) {
  var lowestPing = Infinity;
  var target = this.key;

  var check = function (node, totalPing) {
    totalPing = totalPing + node.value || node.value;
    if (totalPing <= lowestPing && node.children.length < 2) {
      lowestPing = node.value;
      target = node;
    } else {
      node.children.forEach(function (child) {
        check(child, totalPing);
      });
    }
  };

  check(this);

  target.children.push(new Tree(key, value, this.host));

  if (callback) {
    callback(target.key, key);
  }
};

Tree.prototype._insert = function (tree, callback) {
  var lowestPing = Infinity;
  var target = this.key;

  var check = function (node, totalPing) {
    totalPing = totalPing + node.value || node.value;
    if (totalPing < lowestPing && node.children.length < 2) {
      lowestPing = node.value;
      target = node;
    } else {
      node.children.forEach(function (child) {
        check(child, totalPing);
      });
    }
  };

  check(this);

  target.children.push(tree);

  if (callback) {
    callback(target.key, tree.key);
  }
};

Tree.prototype.remove = function (key, callback) {
  //Iterate through the children
  for (var i = 0; i < this.children.length; i++) {
    //Remove the current child if it is the one we are looking for:
    if (this.children[i].key === key) {
      var temp = this.children[i];

      this.children.splice(i, 1);
      
      temp.children.forEach(function (child) {
        temp.host._insert(child, callback);
      });
    //Recurse if the current child is not the one we are looking for:
    } else {
      this.children[i].remove(key);
    }
  }
};

Tree.prototype._remove = function (key) {
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].key === key) {

      this.children.splice(i, 1);

    } else {
      this.children[i]._remove(key);
    }
  }
};

Tree.prototype.map = function (callback) {
  this.value = callback(this.key, this.value);

  this.children.forEach(function (child) {
    child.map(callback);
  });
};

Tree.prototype.breadthFirstSelect = function (callback) {
  var queue = [];

  queue.push(this);

  var current;
  while (queue.length) {
    current = queue.shift();
    current.children.forEach(function (child) {
      queue.push(child);
    });

    callback(current);
  }
};

module.exports = Tree;

















