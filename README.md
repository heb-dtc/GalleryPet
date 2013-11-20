Gallery Pet:

Raspberry Pi embedded into a "pet":
  - it is possible to upload content on the "pet" (videos, audio, images)
  - it is possible to visualise it via a web interface, from a phone or computer
  - the "pet" is always showing a fulscreen SlideShow of the images that have been uploaded

Upload Server / Display website:
- Node.js app. running on the Raspberry Pi
- upload require login/password
- only JPEG, PNG, MP4 and MP can be uploaded
- browsing the content is done via a website (mininal CSS here, but potentially customizable)
- using EJS to render the views

SlideShow:
- The RPi HDMI output is connected to a beamer
- Using Quick Image Viewer app. (QVI) to make the slide show

Practical details:
- RPi autoboots and startX automatically (using raspi-config command)
- using autostart scripts:
	--> starts QIV --> qiv -msf pathtopictures (fullscreen + scaling of pictures if needed)
	--> starts Node.js server
- server is reachable via:
	- IP:8080 (for devices that aren´t running Bonjour Discovery service)
or  - domainName:8080 (only devices running Bonjour Discovery service can reach this)
To make this possible, the .local domain of the RPi needs to be assigned:
	- support for Bonjour needs to be installed on the RPi (using avahi-daemon)
	- by default this will make it possible to access the RPi via: raspberry.local
	- of course the hostname can be changed:
		--> in /etc/hosts (line 127.0.1.1) change raspberrypi with the new hostname
	--> in /etc/hostname change raspberrypi with the new hostname
	--> commit the changes: sudo /etc/init.d/hostname.sh
	--> reboot