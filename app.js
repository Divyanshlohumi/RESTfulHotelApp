var express = require('express');
    methodOverride = require('method-override');
    expressSanitizer = require('express-sanitizer');
    app = express();
    bodyParser = require('body-parser');
    mongoose = require('mongoose');
    
mongoose.connect("mongodb://localhost/restfulhotelapp", {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var hotelSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    price: Number,
    place: String,
    amenities: String,
    rating: Number,
    discount: Number
});

var Hotel = mongoose.model("Hotel", hotelSchema);

// Hotel.create({
//     title: "Test hotel",
//     image: "https://thumbs.dreamstime.com/b/hotel-room-23802674.jpg",
//     body: "This is a test hotel!",
//     price: 24000,
//     place: "Dubai",
//     amenities: "Free Wifi and Laundering",
//     rating: 4.5,
//     discount: 40
// });

// RESTFUL Routes

 app.get("/", function(req, res){
    res.redirect("/hotels");
});

//INDEX Route
app.get("/hotels", function(req, res){
    Hotel.find({}, function(err, hotels){
        if (err){
            console.log(err);
        } else{
            res.render("index", {hotels: hotels});
        }
    });
});

//NEW Route
app.get("/hotels/new", function(req, res){
    res.render("new");
});

//CREATE Route
app.post("/hotels", function(req, res){
    req.body.hotel.body = req.sanitize(req.body.hotel.body);
    Hotel.create(req.body.hotel, function(err, newHotel){
        if(err){
            res.render("new");
        } else{
            res.redirect("/hotels");
        }
    });
});

//SHOW Route
app.get("/hotels/:id", function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            res.redirect("/hotels");
        } else{
            res.render("show", {hotel: foundHotel});
        }
    });                   
});

//EDIT Route
app.get("/hotels/:id/edit", function(req,res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            res.redirect("/hotels");
        } else{
            res.render("edit", {hotel: foundHotel});
        }
    });  
});

//UPDATE Route
app.put("/hotels/:id", function(req, res){
    req.body.hotel.body = req.sanitize(req.body.hotel.body);
    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedHotel){
        if(err){
            res.redirect("/hotels");
        } else{
            res.redirect("/hotels/" + req.params.id);
        }
    }) 
});

//DELETE Route
app.delete("/hotels/:id", function(req, res){
    Hotel.findByIdAndRemove(req.params.id, function(err, deletehotel){
        if(err){
            res.redirect("/hotels");
        } else{
            res.redirect("/hotels");
        }
    });
});

app.listen(3500, function(){
    console.log("Sever has Started!!");
});
    