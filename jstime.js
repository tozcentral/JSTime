(function(window,document,undefined){
	var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var longMonths = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var suffix = ['st', 'nd', 'rd', 'th', 'am', 'pm', 'AM', 'PM'];

	var languages = {
		en: {
			shortDays:		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			longDays:		['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

			shortMonths:	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			longMonths:		['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			
			suffix:			['st', 'nd', 'rd', 'th']
		}
	};

	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var daysToMonth = [0, 31, 31+28, 31+28+31, 31+28+31+30, 31+28+31+30+31, 31+28+31+30+31+30, 31+28+31+30+31+30+31, 31+28+31+30+31+30+31+31, 31+28+31+30+31+30+31+31+30, 31+28+31+30+31+30+31+31+30+31, 31+28+31+30+31+30+31+31+30+31+30, 31+28+31+30+31+30+31+31+30+31+30+31];

	// http://stackoverflow.com/questions/11887934/check-if-daylight-saving-time-is-in-effect-and-if-it-is-for-how-many-hours
	function getStandardTimezoneOffset ( date )
	{
		var jan = new Date ( date.getFullYear ( ), 0, 1 );
		var jul = new Date ( date.getFullYear ( ), 6, 1 );

		return Math.max ( jan.getTimezoneOffset ( ), jul.getTimezoneOffset ( ) );
	}

	function isDST ( date )
	{
		return date.getTimezoneOffset ( ) < getStandardTimezoneOffset ( date );
	}

	function toDigits ( number, digits, prefix )
	{
		if ( !prefix )
			prefix = '0';

		var text = number.toString ( );

		while ( text.length < digits )
			text = prefix + text;

		return text;
	}

	function formatArgument ( time, type )
	{
		switch ( type )
		{
			// Day
			case 'd': // Day of the month, 2 digits with leading zeros
				return toDigits ( time.getDate ( ), 2 );
			break;
			case 'D': // A textual representation of a day, three letters
				return shortDays[time.getDay ( )];
			break;
			case 'j': // Day of the month without leading zeros
				return time.getDate ( );
			break;
			case 'l': // A full textual representation of the day of the week
				return longDays[time.getDay ( )];
			break;
			case 'N': // ISO-8601 numeric representation of the day of the week
				var day = time.getDay ( );
				return day == 0 ? 7 : day;
			break;
			case 'S': // English ordinal suffix for the day of the month, 2 characters
				return time.getDate ( ) > 3 ? suffix[3] : suffix[time.getDate ( ) - 1];
			break;
			case 'w': // Numeric representation of the day of the week
				return time.getDay ( );
			break;
			case 'z': // The day of the year (starting from 0)
				var month = time.getMonth ( );
				var days = daysToMonth[month];
				if ( month > 1 && time.getFullYear ( ) % 4 == 0 )
					days += 1;
				return days + time.getDate ( );
			break;

			// Week
			case 'W': // ISO-8601 week number of year, weeks starting on Monday
				throw new Error ( 'Not Implemented: W' );
			break;

			// Month
			case 'F': // A full textual representation of a month, such as January or March
				return longMonths[time.getMonth ( )];
			break;
			case 'm': // Numeric representation of a month, with leading zeros
				return toDigits ( time.getMonth ( ) + 1, 2 );
			break;
			case 'M': // A short textual representation of a month, three letters
				return shortMonths[time.getMonth ( )];
			break;
			case 'n': // Numeric representation of a month, without leading zeros 	1 through 12
				return time.getMonth ( ) + 1;
			break;
			case 't': // Number of days in the given month							28 through 31
				var month = time.getMonth ( );
				if ( month == 1 && time.getFullYear ( ) % 4 == 0 );
					return 29;
				return daysInMonth[month];
			break;

			// Year
			case 'L': // Whether it's a leap year									1 if it is a leap year, 0 otherwise.
				return time.getFullYear ( ) % 4 == 0 ? 1 : 0;
			break;
			case 'o': // ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
				throw new Error ( 'Not Implemented: o' );
			break;
			case 'Y': // A full numeric representation of a year, 4 digits			Examples: 1999 or 2003
				return time.getFullYear ( );
			break;
			case 'y': // A two digit representation of a year						Examples: 99 or 03
				return parseInt ( time.getFullYear ( ).toString ( ).substr ( 2, 2 ) );
			break;

			// Time
			case 'a': // Lowercase Ante meridiem and Post meridiem 					am or pm
				var hours = time.getHours ( );
				return hours > 0 && hours <= 12 ? suffix[4] : suffix[5];
			break;
			case 'A': // Uppercase Ante meridiem and Post meridiem 					AM or PM
				var hours = time.getHours ( );
				return hours > 0 && hours <= 12 ? suffix[6] : suffix[7];
			break;
			case 'B': // Swatch Internet time 										000 through 999
				throw new Error ( 'Not Implemented: B' );
			break;
			case 'g': // 12-hour format of an hour without leading zeros 			1 through 12
				var hours = time.getHours ( );
				return hours === 0 ? 12 : hours <= 12 ? hours : hours - 12;
			break;
			case 'G': // 24-hour format of an hour without leading zeros 			0 through 23
				return time.getHours ( );
			break;
			case 'h': // 12-hour format of an hour with leading zeros 				01 through 12
				var hours = time.getHours ( );
				return toDigits ( hours === 0 ? 12 : hours <= 12 ? hours : hours - 12, 2 );
			break;
			case 'H': // 24-hour format of an hour with leading zeros 				00 through 23
				var hours = time.getHours ( );
				return toDigits ( hours, 2 );
			break;
			case 'i': // Minutes with leading zeros 								00 to 59
				var minutes = time.getMinutes ( );
				return toDigits ( minutes, 2 );
			break;
			case 's': // Seconds, with leading zeros 								00 through 59
				var seconds = time.getSeconds ( );
				return toDigits ( seconds, 2 );
			break;
			case 'u': // Microseconds
				throw new Error ( 'Not Implemented: u' );
			break;

			// Timezone
			case 'e': // Timezone identifier 									 	Examples: UTC, GMT, Atlantic/Azores
				throw new Error ( 'Not Implemented: e' );
			break;
			case 'I': // Whether or not the date is in daylight saving time 		1 if Daylight Saving Time, 0 otherwise.
				return isDST ( time ) ? 1 : 0;
			break;
			case 'O': // Difference to Greenwich time (GMT) in hours 				Example: +0200
				var hours = parseInt ( time.getTimezoneOffset ( ) / 60 );
				var minutes = time.getTimezoneOffset ( ) % 60;
				return [(hours > 0 ? '-' : '+'), toDigits ( Math.abs ( hours ), 2 ), toDigits ( Math.abs ( minutes ), 2 )].join ( '' );
			break;
			case 'P': // Difference to Greenwich time (GMT) with colon between hours and minutes 	Example: +02:00
				var hours = parseInt ( time.getTimezoneOffset() / 60 );
				var minutes = time.getTimezoneOffset() % 60;
				return [(hours > 0 ? '-' : '+'), toDigits ( Math.abs ( hours ), 2 ), ':', toDigits ( Math.abs ( minutes ), 2 )].join ( '' );
			break;
			case 'T': // Timezone abbreviation 	Examples: EST, MDT ...
				throw new Error ( 'Not Implemented: T' );
			break;
			case 'Z': // Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive. 	-43200 through 50400
				throw new Error ( 'Not Implemented: Z' );
			break;

			// Full Date/Time
			case 'c': // ISO 8601 date 					 							2004-02-12T15:19:21+00:00
				return formatTime ( 'Y-m-d\\TH:i:sP', time );
			break;
			case 'r': // RFC 2822 formatted date 									Example: Thu, 21 Dec 2000 16:01:07 +0200
				return formatTime ( 'D, d M Y H:i:s O', time );
			break;
			case 'U': // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
				return time.getTime ( );
			break;

			default:
				return type;
				//throw new Error ( ['Unknown type "', type, '"'].join('') )
		}
	}

	function formatTime ( format, time )
	{
		var text = [];
		var escape = false;

		for ( var i = 0, c = format.length; i < c; i++ )
		{
			if ( !escape && format[i] == '\\' )
			{
				escape = true;
				continue;
			}

			if ( !escape )
				text.push ( formatArgument ( time, format[i] ) );
			else
				text.push ( format[i] );

			escape = false;
		}

		return text.join ( '' );
	}

	function formatNode ( node, format )
	{
		if ( !node )
			return;

		var time;
		if ( node.nodeName == 'TIME' )
			time = node.getAttribute ( 'datetime' );
		else
			time = node.getAttribute ( 'data-datetime' );

		if ( time )
			node.innerHTML = formatTime ( format, new Date ( time ) );
		else
			node.innerHTML = formatTime ( format, new Date ( ) );
	}

	function updateNode ( node )
	{
		if ( !node || node.nodeType != 1 )
			return;

		var format = node.getAttribute ( 'data-format' );

		if ( !format )
			return;

		formatNode ( node, format );
	}

	function scanNode ( node )
	{
		var times = node.getElementsByTagName ( 'time' );
		Array.prototype.forEach.call ( times, updateNode );
		//for ( var i = 0, c = times.length; i < c; i++ )
		//	updateNode ( times[i] );
	}

	function scanPage ( )
	{
		scanNode ( document );
	}
	
	var observer = new MutationObserver ( function ( mutations ) {
		mutations.forEach ( function ( mutation ) {
			if ( mutation.type == 'childList' )
			{
				Array.prototype.forEach.call ( mutation.addedNodes, updateNode );
			}
			else if ( mutation.type == 'attributes' )
			{
				updateNode ( mutation.target );
			}
		} );
	} );
	
	function enableObserver ( )
	{
		var config = {
			attributes: true,
			childList: true,
			subtree: true,
			attributeFilter: ['datetime', 'data-datetime', 'data-format']
		};
		
		observer.observe ( document.body, config );
	}
	
	function disableObserver ( )
	{
		observer.disconnect ( );
	}
	
	function setLanguage ( code )
	{
		if ( !( code in languages ) )
			throw new Error ( 'Unknown language ' + code );

		shortDays =		languages[code].shortDays;
		longDays =		languages[code].longDays;

		shortMonths =	languages[code].shortMonths;
		longMonths =	languages[code].longMonths;

		suffix =		languages[code].suffix;
	}

	window.JSTime = {
		format:				formatTime,
		updateNode:			updateNode,
		scanNode:			scanNode,
		scanPage:			scanPage,
		enableObserver:		enableObserver,
		disableObserver:	disableObserver,

		setLanguage:		setLanguage,
		languages:			languages,

		ATOM:				'Y-m-d\TH:i:sP',
		COOKIE:				'l, d-M-Y H:i:s T',
		HTTP:				'D, d M y H:i:s O',
		RSS:				'D, d M Y H:i:s O',
		W3C:				'Y-m-d\\TH:i:sP',

		ISO8601:			'Y-m-d\\TH:i:sO',

		RFC822:				'D, d M y H:i:s O',
		RFC850:				'l, d-M-y H:i:s T',
		RFC1036:			'D, d M y H:i:s O',
		RFC1123:			'D, d M Y H:i:s O',
		RFC2822:			'D, d M Y H:i:s O',
		RFC3339:			'Y-m-d\\TH:i:sP'
	};

	scanPage ( );
})(window,document);
