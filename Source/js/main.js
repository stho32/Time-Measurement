var ViewModel = function (durationInMinutes) {
    "use strict";
    var self = {};

    self.startValue = durationInMinutes * 60; 

    self.remainingSeconds = ko.observable(self.startValue);
    self.running = ko.observable(false);
    self.totalPomodorosToday = ko.observable(0);
    self.noteText = ko.observable("");

    self.inputMinutes = ko.observable(60);  // Default to 60 minutes

    self.setDuration = function() {
        var neueDauer = parseInt(self.inputMinutes(), 10);
        if (!isNaN(neueDauer) && neueDauer > 0) {
            self.startValue = neueDauer * 60;
            self.remainingSeconds(self.startValue);
        }
    };

    self.remainingTime = ko.computed(function () {
        var remainingSeconds = parseInt(ko.unwrap(self.remainingSeconds), 10);
        var minutes = Math.floor(remainingSeconds / 60);
        var seconds = remainingSeconds % 60;

        var minutesString = minutes.toString();
        var secondsString = seconds.toString();

        var display = "";
        if (minutesString.length === 1) display += "0";
        display += minutesString;
        display += ":";
        if (secondsString.length === 1) display += "0";
        display += secondsString;

        /* Show remaining time in the pages title */
        $("head title").text(display);

        return display;
    });

    self.timestamp = function () {
        var time = new Date();
        return ("0" + time.getHours()).slice(-2) + ":" +
            ("0" + time.getMinutes()).slice(-2) + " (" +
            self.remainingTime() + "min)";
    }

    self.alert = function () {
        self.note("...pomodoro complete!")
        self.totalPomodorosToday(self.totalPomodorosToday() + 1);

        var audioElement = document.getElementById('audiostuff');
        audioElement.play();
    }

    self.soundTestClick = function () {
        var audioElement = document.getElementById('audiostuff');
        audioElement.play();
    }

    self.note = function (noteThis, writeBold) {
        var $newNote = $("<li></li>").text(self.timestamp() + ": " + noteThis);
        if (writeBold) {
            $newNote.css("font-weight", "bold");
        }
        else {
            $newNote.css("font-size", "0.9em");
            $newNote.css("font-style", "italic");
        }
        $(".notes").append($newNote);
    }

    self.writeDownNote = function () {
        if (self.noteText() !== "") {
            self.note(self.noteText(), true);
            self.noteText("");
        }
    }

    self.runningInterval = function () {
        if (self.running()) {
            var remainingSeconds = self.remainingSeconds();
            if (remainingSeconds > 0) {
                remainingSeconds -= 1;
                self.remainingSeconds(remainingSeconds);
            }

            if (remainingSeconds === 0) {
                self.stopClick();
                self.alert();
            }
        }
    }

    self.startClick = function () {
        if (self.remainingSeconds() > 0) {
            self.running(true);

            self.note("pomodoro running...");
        }
    }

    self.stopClick = function () {
        if (self.running()) {
            self.note("pomodoro paused.");
            self.running(false);
        }
    }

    self.resetClick = function () {
        self.note("reset at " + self.remainingTime() + "min");
        self.running(false);
        self.remainingSeconds(self.startValue);
    }

    window.setInterval(self.runningInterval, 1000);

    return self;
};

 
