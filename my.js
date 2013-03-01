// Create database
var lib = new localStorageDB("note", localStorage);
var tblNote = "note";
var tmpId = null;
if(lib.isNew()) {
	// create the "note" table
    lib.createTable(tblNote, ["content", "date"]);
    
    // insert some data
    lib.insert("note", {content: "This is node #1", date: "22/12/1992"});
    lib.insert("note", {content: "This is node #1", date: "22/12/1992"});
    
    // commit the database to localStorage
    // all create/drop/insert/update/delete operations should be committed
    lib.commit();
}
//Initialize the note list
function addToList(ID, content) {
	var html = '<li data-theme="c" id="item'+ ID +'"><a href="#note-view" class="link-note" data-transition="slide" data-number="'+ ID +'">'+ content.replace(/<br\/>/g, " ") + '</a></li>';
		$("#note-list").append(html);
}
function listLoader() {
	var notes = lib.query(tblNote);
	var n = lib.query(tblNote).length;
	for(var i=0; i<n; i++) {
		addToList(notes[i].ID, notes[i].content);
	}
}
listLoader();


//View note
$(".link-note").live("click", function() {
	console.log("clicked");
	console.log(this.dataset.number);
	var id = this.dataset.number;
	tmpId = id;
	//console.log("id = " + id);
	var date = lib.query(tblNote, {ID: id})[0].date;
	var content = lib.query(tblNote, {ID: id})[0].content;
	$("#note-content").html(content.replace(/\n/g, "<br/>"));
	$("#note-view .date").html(date);
});

//Add new note
function addNewNote(content) {
	//add new note to database
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
 	var fulldate = ((''+day).length<2 ? '0' : '') + day + '/' + ((''+month).length<2 ? '0' : '') + month + '/' + d.getFullYear();
 	lib.insert(tblNote, {content: content, date: fulldate});
 	lib.commit();
 	//add new note to current list
 	var note = lib.query(tblNote)[lib.query(tblNote).length-1];
 	var id = note.ID;
 	var content = note.content;
 	addToList(id, content);
 	$("#note-list").listview("refresh");
}

$("#btnSubmitAdd").live("click", function() {
	var content = ($("#txtNote").val() != "") ? $("#txtNote").val() : null;
	if(content == null) return false;
	addNewNote(content);
	$("#txtNote").val("");
});

$(".link-note").swiperight(function() {
	tmpId = this.dataset.number;
	console.log("swiperight");
	//alert("swiped");
	$("#confirm-delete").popup();
	$("#confirm-delete").popup("open", {positionTo: "window", transition: "pop"});
	$("#confirm-delete-popup a").button();
});
$(".link-note").live("mousedown", function(e) {
    e.preventDefault();
    if(e.which == 2) {
    	console.log("right-clicked!");
    }
});

$("#delete-button").live("click", function() {
	if(tmpId != null) {
		lib.deleteRows(tblNote, {ID: tmpId});
		lib.commit();
	}
	$("#item" + tmpId).fadeOut("slow", function() {
		$(this).remove();
	});
});

$("#back-save").live("click", function() {
	console.log($("#note-content").html().replace(/<div>/g, "<br/>").replace(/<\/div>/g, "").replace(/<br>/g, ""));
	var content = $("#note-content").html().replace(/<div>/g, "<br/>").replace(/<\/div>/g, "").replace(/<br>/g, "");
	lib.insertOrUpdate(tblNote, {ID: tmpId}, {content: content});
	lib.commit();
	$("#note-list").html("");
	listLoader();
	$("#note-list").listview("refresh");
	$(".link-note").swiperight(function() {
		tmpId = this.dataset.number;
		console.log("swiperight");
		//alert("swiped");
		$("#confirm-delete").popup();
		$("#confirm-delete").popup("open", {positionTo: "window", transition: "pop"});
		$("#confirm-delete-popup a").button();
	});
});
