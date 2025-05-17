const CONSTANTS = {
	chat: {
		"_default": {
			className: "chatMsg",
		},
		"guest": {
			className: "guestMsg",
		},
		"server": {
			className: "serverMsg",
			nonBlockable: true,
		},
		"dev": {
			className: "chatMsg",
			nonBlockable: true,
			tag: {
				className: "devTag",
				text: "[Dev]"
			}
		},
		"jrdev": {
			className: "chatMsg",
			nonBlockable: true,
			tag: {
				className: "jrDevTag",
				text: "[Jr.Dev]"
			}
		},
		"headmod": {
			className: "chatMsg",
			nonBlockable: true,
			tag: {
				className: "headModTag",
				text: "[Head Mod]"
			}
		},
		"srmod": {
			className: "chatMsg",
			nonBlockable: true,
			tag: {
				className: "srModTag",
				text: "[Sr.Mod]"
			}
		},
		"mod": {
			className: "chatMsg",
			nonBlockable: true,
			tag: {
				className: "modTag",
				text: "[Mod]"
			}
		},
		"jrmod": {
			className: "chatMsg",
			nonBlockable: true,
			tag: {
				className: "jrModTag",
				text: "[Jr.Mod]"
			}
		},
		"yt": {
			className: "chatMsg",
			tag: {
				className: "ytTag",
				text: "[YouTuber]"
			}
		},
		"supporter": {
			className: "chatMsg",
			tag: {
				className: "supporterTag",
				text: "[Supporter]"
			}
		},
		"bug": {
			className: "chatMsg",
			tag: {
				className: "bugTag",
				text: "[Bug Finder]"
			}
		},
		"testsmp": {
			className: "chatMsg",
			tag: {
				className: "testsmpTag",
				text: "[MaP]"
			}
		},
		"contributor": {
			className: "chatMsg",
			tag: {
				className: "contributorTag",
				text: "[Contributor]"
			}
		},

	},
	modes: [
		"Classic",
		"Hard",
		"Crazy",
		"Space",
		"Battle",
		"Cold",
		"Assorted",
		"Sauna",
		"Arena"
	],
	worlds: {
		"_default": {
			fillStyle: "white",
			title: {
				fillStyle: "#f4faff",
				strokeStyle: "#425a6d"
			}
		},
		"Arduous Abyss": {
			fillStyle: "#d49b83",
			title: {
				fillStyle: "#ffccaa",
				strokeStyle: "#aa7766"
			}
		},
		"Atrocious Arena": {
			fillStyle: "#ad6666",
			title: {
				fillStyle: "#ffccba",
				strokeStyle: "#aa7786"
			}
		},
		"Accelerating Aisle": {
			fillStyle: "#c2a1be",
			title: {
				fillStyle: "#ffddee",
				strokeStyle: "#a08090"
			}
		},
		"Accelerating Aisle Hard": {
			fillStyle: (a) => {
				return `rgb(${189 - ((a - 1) % 10) / 10 * 20}, ${142 - ((a - 1) % 10) / 10 * 80}, ${183 - ((a - 1) % 10) / 10 * 60})`
			},
			title: {
				fillStyle: "#a67b90",
				strokeStyle: "#78606c"
			}
		},
		"Scorching Shaft": {
			fillStyle: "#ff0000",
			title: {
				fillStyle: "#ffaaaa",
				strokeStyle: "#774444"
			}
		},
		"Scorching Shaft Hard": {
			fillStyle: "#2181c2",
			title: {
				fillStyle: "#ffffff",
				strokeStyle: "#2181c2"
			}
		},

		"Tired Tavern": {
			fillStyle: "#805937",
			title: {
				fillStyle: "#ffddbb",
				strokeStyle: "#665544"
			}
		},
		"The Tetar Trials": {
			fillStyle: "#bcb1de",
			title: {
				fillStyle: "#ddccff",
				strokeStyle: "#776699"
			}
		},
		"Monochrome Mission": {
			fillStyle: "#000000",
			title: {
				fillStyle: "#aaa",
				strokeStyle: "#555"
			}
		},
		"Monochrome Mission Hard": {
			fillStyle: "#000000",
			title: {
				fillStyle: "#777",
				strokeStyle: "#000"
			}
		},
		"Calamitic Coliseum": {
			fillStyle: "#eeeeee",
			title: {
				fillStyle: "#f66",
				strokeStyle: "#a00"
			}
		},

		"become sus": {
			fillStyle: () => "hsl(" + (Date.now() / 10) + ", 50%, 50%)",

			title: {
				fillStyle: () => "hsl(" + (Date.now() / 10) + ", 50%, 50%)",
				strokeStyle: () => "hsl(" + (Date.now() / 10) + ", 50%, 20%)",

				fillStyleLB: "hsl(0, 50%, 50%)",
				strokeStyleLB: "hsl(0, 50%, 20%)"
			}
		},
		"become sus hard": {
			fillStyle: () => "hsl(" + (Date.now() / 4) + ", 50%, 50%)",

			title: {
				fillStyle: () => "hsl(" + (Date.now() / 4) + ", 50%, 50%)",
				strokeStyle: () => "hsl(" + (Date.now() / 4) + ", 50%, 20%)",

				fillStyleLB: "hsl(0, 50%, 50%)",
				strokeStyleLB: "hsl(0, 50%, 20%)"
			}
		},
		"become sus insane": {
			fillStyle: () => "hsl(" + (Date.now() / 2) + ", 70%, 30%)",

			title: {
				fillStyle: () => "hsl(" + (Date.now() / 2) + ", 70%, 30%)",
				strokeStyle: () => "hsl(" + (Date.now() / 2) + ", 70%, 10%)",

				fillStyleLB: "hsl(0, 50%, 50%)",
				strokeStyleLB: "hsl(0, 50%, 20%)"
			}
		},

		"Corrupted Core": {
			fillStyle: "#eeeeee",
		},
		"Endless": {
			fillStyle: "#b1aed6",
		},
		"Duel": {
			fillStyle: "#b1aed6",
		},
		"Catch": {
			fillStyle: "#b1aed6",
		},
		"CTF": {
			fillStyle: "#b1aed6",
		},
		"Snail Salon": {
			fillStyle: "#e2c7a7",

			title: {
				fillStyle: "#e2a2a7",
				strokeStyle: "#c00020"
			}
		},
		"Snail Salon Hard": {
			fillStyle: "#8a7966",

			title: {
				fillStyle: "#ad767a",
				strokeStyle: "#590210"
			}
		},

		"Crazy Cosmos": {
			fillStyle: "#9b8cad",

			title: {
				fillStyle: "#bbaaff",
				strokeStyle: "#7766bb"
			}
		},
		"Crazy Cosmos Hard": {
			fillStyle: "#635870",

			title: {
				fillStyle: "#664ad9",
				strokeStyle: "#2b1780"
			}
		},
		"Crowded Cavern": {
			fillStyle: "#7a7252",

			title: {
				fillStyle: "#fff0ef",
				strokeStyle: "#aa997a"
			}
		},
		"Crowded Cavern Hard": {
			fillStyle: "#544f38",

			title: {
				fillStyle: "#fff0ef",
				strokeStyle: "#aa997a"
			}
		},
		"Methodical Monastery": {
			fillStyle: "#f4b3f5",

			title: {
				fillStyle: "#ffbbcc",
				strokeStyle: "#bb7788"
			}
		},
		"Methodical Monastery Hard": {
			fillStyle: "#cf62d1",

			title: {
				fillStyle: "#e8587c",
				strokeStyle: "#912641"
			}
		},
		"Monumental Migration": {
			fillStyle: "#f3e6ff",

			title: {
				fillStyle: "#ddaaff",
				strokeStyle: "#440066"
			}
		},
		"Monumental Migration+ OG": {
			fillStyle: "#f3e6ff",

			title: {
				fillStyle: "#ddaaff",
				strokeStyle: "#440066"
			}
		},

		"Immoral Inferno": {
			fillStyle: "#ad433b",

			title: {
				fillStyle: "#ad433b",
				strokeStyle: "#612520"
			}
		},
		"Glamorous Glacier": {
			fillStyle: "#3fb5e8",

			title: {
				fillStyle: "#abcdef",
				strokeStyle: "#29508f"
			}
		},
		"Glamorous Glacier Hard": {
			fillStyle: "#0eeded",

			title: {
				fillStyle: "#7ac4d6",
				strokeStyle: "#508996"
			}
		},

		"Permeating Perpetuity": {
			fillStyle: "#cbd420",

			title: {
				fillStyle: "#FFD700",
				strokeStyle: "#c4a600"
			}
		},
		"Permeating Perpetuity Hard": {
			fillStyle: "#8b9116",

			title: {
				fillStyle: "#ba9d02",
				strokeStyle: "#696900"
			}
		},

		"Terrifying Tomb": {
			fillStyle: (area) => {
				let c = "#000000";
				if (area == 1) {
					c = "#11111199"
				} else if (area == 2) {
					c = "#05050599";
				} else if (area == 3) {
					c = "#01010199";
				} else if (area == 4) {
					c = "#333333";
				} else if (area == 5) {
					c = "#111111";
				} else if (area == 6) {
					c = "#000000";
				}
				return c;
			},

			title: {
				fillStyle: "#000000",
				strokeStyle: "#ffd700"
			}
		},
		"Terrifying Tomb Hard": {
			fillStyle: (area) => {
				let c = "#000000";
				if (area == 1) {
					c = "#11111199"
				} else if (area == 2) {
					c = "#05050599";
				} else if (area == 3) {
					c = "#01010199";
				} else if (area == 4) {
					c = "#333333";
				} else if (area == 5) {
					if (Math.sin(Date.now() / 113) * Math.cos(Date.now() / 91) < 0.8) {
						c = "#111111";
					}
					else {
						c = "#aaaaaa";
					}
				} else if (area == 6) {
					if (Math.sin(Date.now() / 53) * Math.cos(Date.now() / 41) * Math.sin(Date.now() / 37) < 0.7) {
						c = "#000000";
					}
					else {
						c = "#ffffff";
					}
				}
				return c;
			},

			title: {
				fillStyle: "#000000",
				strokeStyle: "#00ffee"
			}
		},

		"Cryptic Corridor": {
			fillStyle: "#6e2133",

			title: {
				fillStyle: "#6e2133",
				strokeStyle: "#420e17"
			}
		},
		"Cryptic Corridor Hard": {
			fillStyle: "#8a041a",

			title: {
				fillStyle: "#785c63",
				strokeStyle: "#2e2527"
			}
		},

		"Monumental Migration+": {
			fillStyle: "#f3e6ff",

			title: {
				fillStyle: "#ddaaff",
				strokeStyle: "#440066"
			}
		},
		"Toilsome Traverse": {
			fillStyle: "#d9be89",
			title: {
				fillStyle: "#ffccaa",
				strokeStyle: "#aa8866"
			}
		},
		"Strange Space": {
			fillStyle: "#3338a3",
			title: {
				fillStyle: "#aaaaf3",
				strokeStyle: "#555593"
			}
		},
		"Wistful Warping": {
			fillStyle: "#98acb3",
			title: {
				fillStyle: "#eeeeff",
				strokeStyle: "#99aabb"
			}
		},
		"Wistful Warping Hard": {
			fillStyle: "#677b82",
			title: {
				fillStyle: "#a4a4fc",
				strokeStyle: "#30679c"
			}
		},
		"i eat idiot": {
			title: {
				fillStyle: () => `hsl(${Math.random() * 360}, 50%, 50%)`,
				strokeStyle: () => `hsl(${Math.random() * 360}, 50%, 20%)`,

				fillStyleLB: "hsl(138, 100%, 80%)",
				strokeStyleLB: "hsl(138, 100%, 31%)"
			}
		},
		"Amaster Atmosphere": {
			title: {
				fillStyle: () => `hsl(251, 95%, ${60 + Math.sin(Date.now() / 500) * 20}%)`,
				strokeStyle: () => `hsl(251, 95%, ${20 + Math.sin(Date.now() / 500) * 20}%)`,

				fillStyleLB: "hsl(249, 100%, 62%)",
				strokeStyleLB: "hsl(249, 100%, 32%)"
			}
		},
		"enter the sus amogus": {
			title: {
				fillStyle: () => "hsl(" + (Date.now() / 1000 + ((Date.now() % 1000 <= 500) ? 180 : 0)) + ", 50%, 50%)",
				strokeStyle: () => "hsl(" + (Date.now() / 1000 + ((Date.now() % 1000 <= 500) ? 180 : 0)) + ", 50%, 20%)",

				fillStyleLB: "hsl(280, 100%, 50%)",
				strokeStyleLB: "hsl(280, 100%, 20%)"
			}
		},
		"exit the sus amogus": {
			title: {
				fillStyle: () => `hsl(${(Date.now() / 10)}, ${50 + Math.cos(Date.now() / 100) * 50}%, ${50 + Math.sin(Date.now() / 100) * 50}%)`,
				strokeStyle: () => `hsl(${(Date.now() / 10)}, ${50 + Math.cos(Date.now() / 100) * 50}%, ${20 + Math.sin(Date.now() / 100) * 20}%)`,

				fillStyleLB: "hsl(44, 100%, 62%)",
				strokeStyleLB: "hsl(44, 100%, 32%)"
			}
		},
		"Hypnotic Hill": {
			fillStyle: "#aa4499",
			title: {
				fillStyle: "#dd88dd",
				strokeStyle: "#664466"
			}
		},
		"Hypnotic Hill Hard": {
			fillStyle: "#ff00f2",
			title: {
				fillStyle: "#80387c",
				strokeStyle: "#000000"
			}
		},

		"Mouse Mastery": {
			fillStyle: "#55aa33",
			title: {
				fillStyle: "#bbeebb",
				strokeStyle: "#558855"
			}
		},
		"Keyboard Kingdom": {
			fillStyle: "#775522",
			title: {
				fillStyle: "#ffeecc",
				strokeStyle: "#aa8866"
			}
		},
		"Daunting Dimension": {
			fillStyle: "#373d52",
			title: {
				fillStyle: "#d1e4e8",
				strokeStyle: "#3f484a"
			}
		},
		"Daunting Dimension Hard": {
			fillStyle: "#373d52",
			title: {
				fillStyle: "#d1e4e8",
				strokeStyle: "#3f484a"
			}
		},
		"Catastrophic Core": {
			fillStyle: "#aaaaaa",
			title: {
				fillStyle: "#eeeeee",
				strokeStyle: "#333333"
			}
		},
		"Cataclysmic Catastrophe": {
			fillStyle: "#000000",
			title: {
				fillStyle: "#000000",
				strokeStyle: "#000000"
			}
		},
		"Oblique Oblivion": {
			fillStyle: "#512f5c",
			title: {
				fillStyle: "#766385",
				strokeStyle: "#512f5c"
			}
		},
		"Vacant Voltage": {
			fillStyle: "#005c56",
			title: {
				fillStyle: "#00fbff",
				strokeStyle: "#000000"
			}
		},
		"Vacant Voltage Hard": {
			fillStyle: "#000000",
			title: {
				fillStyle: "#008c8c",
				strokeStyle: "#000000"
			}
		},
		"Chaotic Climate": {
			fillStyle: (a) => {
				if (a < 11) {
					return `hsl(0, 100%, ${50 - a * 2}%)`
				}
				else {
					return `hsl(180, ${150 - a * 5}%, 50%)`
				}
			},
			title: {
				fillStyle: "#98ba7f",
				strokeStyle: "#6d855b"
			}
		},

		"Easy Evasion": {
			fillStyle: "#9500ff",
			title: {
				fillStyle: "#c19cdb",
				strokeStyle: "#574563"
			}
		},
		"Easy Evasion Hard": {
			fillStyle: "#52008c",
			title: {
				fillStyle: "#a282b8",
				strokeStyle: "#2f2436"
			}
		},
		"Easy Evasion Insane": {
			fillStyle: "#3d004f",
			title: {
				fillStyle: "#964bc9",
				strokeStyle: "#351847"
			}
		},
		"Easy Evasion Extreme": {
			fillStyle: "#140730",
			title: {
				fillStyle: "#601594",
				strokeStyle: "#390a59"
			}
		},

		"Roving Road": {
			fillStyle: "#80e8a8",
			title: {
				fillStyle: "#95bda4",
				strokeStyle: "#46855e"
			}
		},
		"Boss Brawl": {
			fillStyle: "#375ac4",
			title: {
				fillStyle: "#375ac4",
				strokeStyle: "#1d347a"
			}
		},
		"Breezy Bounce": {
			fillStyle: "#00ff00",
			title: {
				fillStyle: "#00cc00",
				strokeStyle: "#008800"
			}
		},
		"Breezy Bounce Hard": {
			fillStyle: "#00ff00",
			title: {
				fillStyle: "#00cc00",
				strokeStyle: "#008800"
			}
		},
		"Present Parade": {
			fillStyle: (area) => {
				let c = "#1c780e";
				if (area == 1) {
					c = "#000000"
				} else if (area == 21) {
					c = "#ff1100";
				}
				return c;
			},
			title: {
				fillStyle: "#de281b",
				strokeStyle: "#1c780e"
			}
		},
		"Speculative Stratosphere": {
			fillStyle: "#37214a",
			title: {
				fillStyle: "#ffaaaa",
				strokeStyle: "#774444"
			}
		},
		"Speculative Stratosphere Hard": {
			fillStyle: "#6e008f",
			title: {
				fillStyle: "#d48787",
				strokeStyle: "#542b2b"
			}
		},

		"Insidious Invasion": {
			fillStyle: "#000000",
			title: {
				fillStyle: "#005500",
				strokeStyle: "#003300"
			}
		},
		"Heroic Holiday": {
			fillStyle: (area) => {
				let c = "#acb0c2";
				if (area > 10 && area <= 12) c = "#e8d7c5";
				if (area > 12 && area <= 15) c = "#e06e6e";
				if (area == 16) c = "#e08484";
				if (area == 17) c = "#db9a9a";
				if (area == 18) c = "#d6baba";
				if (area > 18 && area <= 20) c = "#ccbcbc";
				if (area == 21) c = "#de3737";
				return c;
			},
			title: {
				fillStyle: "#ffaaaa",
				strokeStyle: "#774444"
			}
		},
		"Peaceful Plains": {
			fillStyle: (area) => {
				let c = "#d6d6ae";
				if (area > 10 && area <= 20) {
					c = "#d4d47d";
				}
				else if (area <= 29) {
					c = "#cfcf48";
				}
				else if (area == 30) {
					c = "#cfaf46";
				}
				else if (area >= 31) {
					c = "#000000";
				}
				return c;
			},
			title: {
				fillStyle: "#ebd834",
				strokeStyle: "#b89432"
			}
		},
		"Ultimate Universe": {
			fillStyle: (area) => {
				let c = "#dbdbdb";
				if (area <= 21) {
					c = "#dbdbdb";
				}
				else if (area <= 41) {
					c = "#b4b2c2";
				}
				else if (area <= 60) {
					c = "#a29ad9";
				}
				else if (area <= 80) {
					c = "#32a84c";
				}
				else if (area <= 100) {
					c = "#2b5394";
				}
				else if (area <= 120) {
					c = "#ccca39";
				}
				else if (area <= 140) {
					c = "#947f7c";
				}
				else if (area <= 160) {
					c = "#abced4";
				}
				else if (area <= 180) {
					c = "#30cff2";
				}
				else if (area <= 200) {
					c = "#c1d9e3";
				}
				else if (area <= 220) {
					c = "#000000";
				}
				else if (area <= 240) {
					c = "#6253ed";
				}
				else if (area <= 260) {
					c = "#eb952d";
				}
				else if (area <= 280) {
					c = "#616161";
				}
				else if (area <= 300) {
					c = "#ffffff";
				}
				else if (area <= 320) {
					c = "#a88582";
				}
				else if (area <= 340) {
					c = "#ab8585";
				}
				else if (area <= 360) {
					c = "#ff0000";
				}
				else if (area <= 361) {
					c = "#f9fc1c";
				}

				return c;
			},
			title: {
				fillStyle: "#ebd834",
				strokeStyle: "#b89432"
			}
		},
		
		"Ultimate Universe Hard": {
			fillStyle: (area) => {
				let c = "#dbdbdb";
				if (area <= 21) {
					c = "#dbdbdb";
				}
				else if (area <= 41) {
					c = "#b4b2c2";
				}
				else if (area <= 60) {
					c = "#a29ad9";
				}
				else if (area <= 80) {
					c = "#32a84c";
				}
				else if (area <= 100) {
					c = "#2b5394";
				}
				else if (area <= 120) {
					c = "#ccca39";
				}
				else if (area <= 140) {
					c = "#947f7c";
				}
				else if (area <= 160) {
					c = "#abced4";
				}
				else if (area <= 180) {
					c = "#30cff2";
				}
				else if (area <= 200) {
					c = "#c1d9e3";
				}
				else if (area <= 220) {
					c = "#000000";
				}
				else if (area <= 240) {
					c = "#6253ed";
				}
				else if (area <= 260) {
					c = "#eb952d";
				}
				else if (area <= 280) {
					c = "#616161";
				}
				else if (area <= 300) {
					c = "#ffffff";
				}
				else if (area <= 320) {
					c = "#a88582";
				}
				else if (area <= 340) {
					c = "#ab8585";
				}
				else if (area <= 360) {
					c = "#ff0000";
				}
				else if (area <= 361) {
					c = "#f9fc1c";
				}

				return c;
			},
			title: {
				fillStyle: "#c2b22b",
				strokeStyle: "#876d24"
			}
		},
		"Furious Fraud": {
			fillStyle: (area) => {
				let c;
				if (area <= 10) {
					c = "#ff7070";
				}
				else if (area <= 30) {
					c = "#ff0000";
				}
				else {
					c = "#000000";
				}
				return c;
			},
			title: {
				fillStyle: "#ff0000",
				strokeStyle: "#ab0000"
			}
		},
		"PENTAGONIS": {
			fillStyle: (area) => {
				let c; //penta dmed me "BLUE"
				c = `hsl(${220}, ${Math.cos(Date.now() / 1000) * 15 + 70}%, ${Math.sin(Date.now() / 1200) * 15 + 60}%)`;
				return c;
			},
			title: {
				fillStyle: "#056dff",
				strokeStyle: "#082b5c"
			}
		},
		"Impossible Isle": {
			fillStyle: "#000000",
			title: {
				fillStyle: "#000000",
				strokeStyle: "#000000"
			}
		},

		"Neko Nightmare": {
			fillStyle: (a) => {
				let avgc = Math.floor(15 - (1.6 * ((((a - 1) % 10))))).toString(16);
				return `#${avgc.repeat(2)}00${avgc.repeat(2)}88`
			},
			title: {
				fillStyle: "#dd00dd",
				strokeStyle: "#880088"
			}
		},
		"Neko Nightmare Original": {
			fillStyle: (a) => {
				let avgc = Math.floor(15 - (1.6 * ((((a - 1) % 10))))).toString(16);
				return `#${avgc.repeat(2)}00${avgc.repeat(2)}88`
			},
			title: {
				fillStyle: "#dd00dd",
				strokeStyle: "#880088"
			}
		},

		"Little Land": {
			fillStyle: "#50a0a0",
			title: {
				fillStyle: "#70c0c0",
				strokeStyle: "#308080"
			}
		},
		"Little Land Hard": {
			fillStyle: "#407373",
			title: {
				fillStyle: "#3c6969",
				strokeStyle: "#0e3636"
			}
		},
		"Wicked War": {
			fillStyle: "#d6761c",
			title: {
				fillStyle: "#d6761c",
				strokeStyle: "#66411e"
			}
		},
		"Wicked War Hard": {
			fillStyle: "#c5650b",
			title: {
				fillStyle: "#c5650b",
				strokeStyle: "#55300d"
			}
		},

		"Grimly Gallows": {
			fillStyle: "#c4c3be",
			title: {
				fillStyle: "#c4c3be",
				strokeStyle: "#ebebeb"
			}
		},
		"Lazy Labyrinth": {
			fillStyle: "#502473",
			title: {
				fillStyle: "#665970",
				strokeStyle: "#3a3240"
			}
		},
		"Euclid Empire": {
			fillStyle: (e) => {
				//after 16: 281°, 14%, 35%
				//before 16: 281°, 0%, 69%
				if (e < 16) {
					return `hsl(281, ${e * 14 / 16}%, ${69 - (69 - 35) / 16 * e}%)`
				}
				else {
					return "#5e4d66";
				}
			},
			title: {
				fillStyle: "#a78db3",
				strokeStyle: "#5e4d66"
			}
		},
		"Depressive Dungeon": {
			fillStyle: (e) => e > 41 ? "#50200099" : "#50200077",
			title: {
				fillStyle: "#502000",
				strokeStyle: "#201000"
			}
		},
		"Perilous Planetarium": {
			fillStyle: "#a1901f",
			title: {
				fillStyle: "#a1901f",
				strokeStyle: "#81600f"
			}
		},
		"Lifeless Laboratory": {
			fillStyle: "#887888",
			title: {
				fillStyle: "#a898a8",
				strokeStyle: "#786878"
			}
		},
		"Zone": {
			fillStyle: "#777777",
			title: {
				fillStyle: "#aaaaaa",
				strokeStyle: "#666666"
			}
		},
		"Watery Water": {
			fillStyle: "#2fa4ed",
			title: {
				fillStyle: "#2fa4ed",
				strokeStyle: "#237ab0"
			}
		},
		"Watery Water Hard": {
			fillStyle: "#1e72a6",
			title: {
				fillStyle: "#1e72a6",
				strokeStyle: "#12415e"
			}
		},
		"Volcanic Village": {
			fillStyle: "#be6216",
			title: {
				fillStyle: "#be6216",
				strokeStyle: "#8e4210"
			}
		},
		"Atomic Alley": {
			fillStyle: "#222288",
			title: {
				fillStyle: "#4444aa",
				strokeStyle: "#222266"
			}
		},
		"CTF": {
			fillStyle: "#CC8F3F",
			title: {
				fillStyle: "#CC8F3F",
				strokeStyle: "#704E22"
			}
		},
		"testsmp": {
			fillStyle: "#CC8F3F",
			title: {
				fillStyle: "#CC8F3F",
				strokeStyle: "#704E22"
			}
		},

	},
	enemies: {
		'normal': 'rgba(120,120,120,1)',
		'noball': 'rgba(0,0,0,0)',
		'invisible': 'rgba(0, 0, 0, 0.3)',
		'glitchednormal': 'rgba(120,120,120,1)',
		'reallyglitchednormal': 'rgba(120,120,120,1)',
		'teleport': 'rgba(255, 255, 0, 1)',
		'tank': 'rgba(70,10,10,1)',
		"movekill": '#509cde',
		"stopkill": "#de8d50",
		"wind": "rgba(180,180,180,0.8)",
		"strongWind": "rgba(250,150,150,0.8)",
		'corrosive': '#00eb00',
		'outside': '#3b0423',
		'immunecorrosive': () => "rgb(0, " + (Math.cos(Date.now() / 1000) * 127 + 127) + ", 0)",
		'immunecorrosivenoshifthuge': () => "rgb(0, " + (Math.cos(Date.now() / 1000) * 127 + 127) + ", 0)",
		'immunecorrosiveless': () => "rgb(0, " + (Math.cos(Date.now() / 1000) * 127 + 127) + ", 0)",
		'immunecorrosivenoshift': () => "rgb(" + (Math.cos(Date.now() / 1000) * 127 + 127) + ", 0, 0)",
		'switch': '#565656',
		'halfswitch': '#565656',
		'quarterswitch': '#565656',
		'seizureswitch': '#565656',
		'disabled': '#5f3975',
		'wall': 'black',
		'sizing': '#f27743',
		'wavy': '#dd2606',
		'zigzag': '#b371f2',
		'turning': '#336600',
		'sniper': '#a05353',
		'homingSniper': "#452222",
		'octo': '#d3134f',
		'icicle': '#adf8ff',
		'ice sniper': '#8300ff',
		'ice octo': '#4c0094',
		'tired': '#a68699',
		'zigzag': '#b371f2',
		'pull': '#78148c',
		'push': '#7b9db2',
		'nebula': '#31013b',
		'blackhole': '#25052b',
		'megapull': '#400078',
		'zoning': '#a03811',
		'speed sniper': '#ff9000',
		'regen sniper': '#00cc8e',
		'energy sniper': '#ccc500',
		'immunedisabler': 'black',
		'immunifier': 'black',
		'immune': 'black',
		'immunepush': 'black',
		'immunepull': 'black',
		'immunefreezing': 'black',
		'dasher': '#003c66',
		'steam': '#c7d5e0aa',
		'halt': '#00ffd9aa',
		'megaSteam': '#a18d8daa',
		'warper': '#217bc2aa',
		'fortifier': 'rgb(255, 0, 234)',
		'boomerang': 'rgb(255, 253, 161)',

		'backdash': '#66005e',
		'dasherswitch': '#003c66',
		'lag': 'rgba(120,120,120,1)',
		'warp': 'rgba(139,129,161,1)',
		'sidewarp': 'rgba(99,99,131,1)',
		'cancer': 'purple',
		'homing': 'rgb(160,120,10)',
		'homingswitch': 'rgb(160,120,10)',
		'tp': 'rgb(160,160,220)',
		'snake': '#3ab077',
		'bouncy': '#00FF00',
		'evilsnake': '#155948',
		'scared': '#042c54',
		'glitch': '#7691b0',
		'growing': '#70e099',
		'trap': 'rgb(80,150,110)',
		'aaaa': () => "hsl(" + (Date.now()) + ", 50%, 50%)",
		'path2': () => "hsl(" + (Date.now() / 10) + ", 20%, 20%)",
		'diagonal': 'rgb(160,210,190)',
		'wallsprayer': 'yellow',
		'liquid': '#6789ef',
		'stutter': '#6c9bab',
		"permafrost": "#dddddd",
		'water': '#7f84eb',
		'waterDropper': '#6066db',
		'frog': '#541087',
		'evilfrog': '#1d0540',
		'yeet': () => "rgb(" + ((Math.cos(Date.now / 100) * 127) + 127) + ", 120,120)",
		'sideways': 'rgb(100,150,100)',
		'transangle': 'rgb(250,230,70)',
		'wipeu': 'cyan',
		'wipeu2': 'lightblue',
		'sweepu': 'chocolate',
		'nut': 'brown',
		'blind': 'darkslategray',
		'tornado': 'rgb(200,200,200)',
		'slower': 'rgb(200,0,0)',
		'ionizer': '#38fff5',
		'orbital': 'rgb(56, 248, 255)',

		'slippery': '#1aacbf',
		'sneaky': '#574d45',
		'draining': '#0000ff',
		'megaDraining': '#502c8a',
		'megafreezing': '#851e0c',
		'soldier': '#857d66',
		'creeper': '#874617',
		'mine': '#b3b83d',
		'jumper': '#734947',
		'eviljumper': '#572c2a',
		'disabler': '#946a8b',
		'freezing': '#64c1b9',
		'subzero': '#3f5d61',
		'burning': '#d6704b',
		'noshift': '#b0563a',
		'invert': '#615e7a',
		'spiral': '#d1c732',
		'sidestep': '#7297b8',
		'ultraspiral': '#90c932',
		'oscillating': '#869e0f',
		'retracing': '#0f9e6a',
		'rain': '#93c1f5',
		'path': '#000000',
		'sliding': '#71c791',
		'latch': '#8e829e',
		'instahoming': '#4a3b28',
		'static': '#00ffd9',
		'electron': '#ffff22',
		'splitter': '#dddddd',

	},
	projectiles: {
		"clay": "#8f754d",
		"guard": "#5c5061",
		"turrBullet": "#bd8b0d",
		"kindleBomb": "#ed6f3e",
		"web": "#333333",
		"webBullet": "#111111",
		"boost": "#7073c4",
		"portalBomb": "#8ad1bb",
		"sniperBullet": "#a05353",
		"homingSniperBullet": "#452222",
		"octoBullet": "#d3134f",
		"iceSniperBullet": "#8300ff",
		"speedSniperBullet": "#ff9000",
		"regenSniperBullet": "#00cc8e",
		"energySniperBullet": "#ccc500",
		"orbitalSniperBullet": 'rgb(56, 248, 255)',
		"amogusBullet": "#a05353",
		"boomerangSniperBullet": "rgb(255, 253, 161)",
		"static": "#00ffd9",
		"earth": "#178031",
		"air": "#a8b5b5",
		"water": "#3081d1",
		"waterDrop": "#6066db",
		"fire": "#d13530",
		"verglas": "#458dc4",
		"missile": "#9e3131",
		"missileDrop": "#cf868666",
		"escargo": "#909c84",
		"snatch": "#b0412a",
		"shard": '#00bcc9',
		"lavaTrail": "#ff000022",
		"slimeTrail": "#aed98022",
		"lavaOrb": () => `rgb(${150 + Math.cos(Date.now() / 500) * 100}, 0, 0)`,
		"latch": "#a3a843",
		"intoxicate": "#50de37",
		"panzerShield": "rgb(50, 50, 50)",
		"panzerBall": "rgb(50, 50, 50)",
		"umbra1": "#79a0a8",
		"umbra2": "#a579a8",
		"umbra3": "#fc03ec",
		"kaminoClone": "#4c3dad",
		"boomerang": "#0384fc",
		"cosmicGift": "#254266",
		"celestialBase": () => `rgb(0, ${130 + Math.cos(Date.now() / 500) * 40}, ${130 + Math.cos(Date.now() / 500) * 40})`,
		'latchSniperBullet': '#8e829e',
		'electron': '#ff0000',
		'freeElectron': '#ff0000',
		'fissionBomb': '#00fffb',
		'megarimBall': '#fdf05d',
		'sicarioBall': '#cfcf44',
		"blackhole": "rgba(0, 0, 0, 0.5)",
		'lavabubble': 'rgba(200, 20, 0, 0.25)',
	},
	heroes: {
		"magmax": {
			"color": "#c80000",
			"ability1": "magmax_1",
			"ability2": "magmax_2",
			"a1desc": "",
			"a2desc": ""
		},
		"floe": {
			"color": "#0db9e4",
			"ability1": "floe_1",
			"ability2": "floe_2",
			"a1desc": "",
			"a2desc": ""
		},
		"rameses": {
			"color": "#989b4a",
			"ability1": "rameses_1",
			"ability2": "rameses_2",
			"a1desc": "",
			"a2desc": ""
		},
		"parvulus": {
			"color": "#9042e3",
			"ability1": "parvulus_1",
			"ability2": "parvulus_2",
			"a1desc": "",
			"a2desc": ""
		},
		"ptah": {
			"color": "#665333",
			"ability1": "ptah_1",
			"ability2": "ptah_2",
			"a1desc": "",
			"a2desc": ""
		},
		"jotunn": {
			"color": "#5cacff",
			"ability1": "jotunn_1",
			"ability2": "jotunn_2",
			"a1desc": "",
			"a2desc": ""
		},
		"kindle": {
			"color": "#ed6f3e",
			"ability1": "kindle_1",
			"ability2": "kindle_2",
			"a1desc": "",
			"a2desc": ""
		},
		"neuid": {
			"color": "#0d6d82",
			"ability1": "neuid_1",
			"ability2": "neuid_2",
			"a1desc": "",
			"a2desc": ""
		},
		"orbital": {
			"color": "#510a6e",
			"ability1": "orbital_1",
			"ability2": "orbital_2",
			"a1desc": "",
			"a2desc": ""
		},
		"cimex": {
			"color": "#777777",
			"ability1": "cimex_1",
			"ability2": "cimex_2",
			"a1desc": "",
			"a2desc": ""
		},
		"janus": {
			"color": "#8ad1bb",
			"ability1": "janus_1",
			"ability2": "janus_2",
			"a1desc": "",
			"a2desc": ""
		},
		"turr": {
			"color": "#bd8b0d",
			"a1desc": "",
			"a2desc": ""
		},
		"anuket": {
			"color": "#4970b3",
			"a1desc": "",
			"a2desc": ""
		},
		"heusephades": {
			"color": "#c2c248",
			"a1desc": "",
			"a2desc": ""
		},
		"verglas": {
			"color": "#84a0b5",
			"a1desc": "",
			"a2desc": ""
		},
		"torpedo": {
			"color": "#915c5c",
			"a1desc": "",
			"a2desc": ""
		},
		"scoria": {
			"color": "#8f7b77",
			"a1desc": "",
			"a2desc": ""
		},
		"felony": {
			"color": "#ff5100",
			"a1desc": "",
			"a2desc": ""
		},
		"cellator": {
			"color": "#805937",
			"a1desc": "",
			"a2desc": ""
		},
		"panzer": {
			"color": "#5f686e",
			"a1desc": "",
			"a2desc": ""
		},
		"magno": {
			"color": "#ff005d",
			"a1desc": "",
			"a2desc": ""
		},
		"gizmo": {
			"color": "#2c3a73",
			"a1desc": "",
			"a2desc": ""
		},
		"thoth": {
			"color": "#c97fbd",
			"a1desc": "",
			"a2desc": ""
		},
		"umbra": {
			"color": "#1b2431",
			"a1desc": "",
			"a2desc": ""
		},
		"kamino": {
			"color": "#4c3dad",
			"a1desc": "",
			"a2desc": ""
		},
		"neko": {
			"color": "#ff33bb",
			"a1desc": "",
			"a2desc": ""
		},
		"Neko": {
			"color": "#ff33bb",
			"a1desc": "",
			"a2desc": ""
		},
		"dendo": {
			"color": "#22ff64",
			"a1desc": "",
			"a2desc": ""
		},
		"quetzal": {
			"color": "#909c84",
			"a1desc": "",
			"a2desc": ""
		},
		"paladin": {
			"color": "#bba3c9",
			"a1desc": "",
			"a2desc": ""
		},
		"seiun": {
			"color": "#6b7480",
			"a1desc": "",
			"a2desc": ""
		},
		"celestial": {
			"color": "#8fa191",
			"a1desc": "",
			"a2desc": ""
		},
		"electrode": {
			"color": "#75f6ff",
			"a1desc": "",
			"a2desc": ""
		},
		"sicario": {
			"color": "#ffb38a",
			"ability1": "sicario_1",
			"ability2": "sicario_2",
			"a1desc": "",
			"a2desc": ""
		},
		"megarim": {
			"color": "#fdf05d",
			"ability1": "megarim_1",
			"ability2": "megarim_2",
			"a1desc": "",
			"a2desc": ""
		},
		"euclid": {
			"color": "#5e4d66"
		},
		"tycoveka": {
			"color": "#aa6600",
			"ability1": "tycoveka_1",
			"ability2": "tycoveka_2",
		},
		"lavablob": {
			"color": "#aa2d1c",
			"ability1": "lavablob_1",
			"ability2": "lavablob_2",
		},
		"dead": {
			"color": "#ff000066",
		}
	},
	hats: {
		"Amogus Hat": {
			order: 10,
			multiX: 1.5,
			multiY: 1.4,
			dX: 0,
			dY: -2,
			gr: 0
		},
		"Crewmate Hat": {
			order: 15,
			multiX: 1.5,
			multiY: 1.4,
			dX: 0,
			dY: -2,
			gr: 0
		},
		"Clown Hat": {
			order: 16,
			multiX: 1.3,
			multiY: 1.3,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Bronze Wreath": {
			order: 40,
			multiX: 1.5,
			multiY: 1.4,
			dX: 0,
			dY: -2,
			gr: 0
		},
		"Cowboy Hat": {
			order: 20,
			multiX: 1.55,
			multiY: 1.45,
			dX: 0,
			dY: -12,
			gr: 0
		},
		"Devil Hat": {
			order: 30,
			multiX: 1.65,
			multiY: 1.65,
			dX: 0,
			dY: -3,
			gr: 0
		},
		"Warp Hat": {
			order: 30.01,
			multiX: 1.55,
			multiY: 1.45,
			dX: 0,
			dY: -3,
			gr: 0
		},
		"Supporter Hat": {
			order: 120,
			multiX: 1.5,
			multiY: 1.5,
			dX: 0,
			dY: 0,
			gr: 0,
			hidden: true
		},

		"Hypnotic Hat": {
			order: 30.02,
			multiX: 1.5,
			multiY: 1.5,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Death": {
			order: 30.025,
			multiX: 0.74,
			multiY: 0.74,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Yin Yang": {
			order: 30.03,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Helmet": {
			order: 30.04,
			multiX: 1.7,
			multiY: 1.7,
			dX: -0.05,
			dY: -0.1,
			gr: 0
		},

		"Bear": {
			order: 32,
			multiX: 1.2,
			multiY: 1.2,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Neko Hat": {
			order: 40,
			multiX: 1.72,
			multiY: 1.72,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"h": {
			order: 59.9,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"hu": {
			order: 59.95,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Spooky Smile": {
			order: 60.01,
			multiX: 1.2,
			multiY: 1.2,
			dX: 0,
			dY: -0.15,
			gr: 0
		},
		"Cat Hat": {
			order: 60.02,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Pig Hat": {
			order: 60.03,
			multiX: 1.58,
			multiY: 1.58,
			dX: -0.05,
			dY: 0.06,
			gr: 0
		},

		"Amethyst Wreath": {
			order: 60.1,
			multiX: 1.5,
			multiY: 1.6,
			dX: 0,
			dY: -2.3,
			gr: 0
		},
		"Diamond Wreath": {
			order: 60.2,
			multiX: 1.5,
			multiY: 1.6,
			dX: 0,
			dY: -2.3,
			gr: 0
		},
		"Celestial Wreath": {
			order: 60.3,
			multiX: 1.8,
			multiY: 1.9,
			dX: 0,
			dY: -2.4,
			gr: 0
		},
		"Gold Wreath": {
			order: 60,
			multiX: 1.5,
			multiY: 1.4,
			dX: 0,
			dY: -2,
			gr: 0
		},
		"Silver Wreath": {
			order: 50,
			multiX: 1.5,
			multiY: 1.4,
			dX: 0,
			dY: -2,
			gr: 0
		},
		"Water Wreath": {
			order: 70,
			multiX: 1.4,
			multiY: 1.4,
			dX: 0,
			dY: -6,
			gr: 0
		},
		"Earth Wreath": {
			order: 70.11,
			multiX: 1.4,
			multiY: 1.4,
			dX: 0,
			dY: -6,
			gr: 0
		},

		"Fire Wreath": {
			order: 70.1,
			multiX: 1.25,
			multiY: 1.3,
			dX: 0,
			dY: -8,
			gr: 0
		},
		"Sunglasses": {
			order: 70.15,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: -3.7,
			gr: 0
		},
		"Bronze Crown": {
			order: 70.2,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Silver Crown": {
			order: 70.3,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Gold Crown": {
			order: 70.4,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Platinum Crown": {
			order: 70.5,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Spring Hat": {
			order: 41,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Summer Hat": {
			order: 41.001,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Autumn Hat": {
			order: 41.002,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Winter Hat": {
			order: 41.003,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},

		"Turr Mini Winner": {
			order: 110,
			multiX: 0.65,
			multiY: 0.65,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Turr Winner": {
			order: 115,
			multiX: 0.65,
			multiY: 0.65,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Pumpkin Red": {
			order: 120,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Pumpkin Yellow": {
			order: 121,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Pumpkin Green": {
			order: 122,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Pumpkin Orange": {
			order: 123,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Pumpkin Purple": {
			order: 124,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 0
		},
		"Dark Hat": {
			order: 130,
			multiX: 1.7,
			multiY: 1.7,
			dX: 0,
			dY: 0,
			gr: 0
		},


		//particles
		"Not Even A Hat": {
			order: 500,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Negative Hat": {
			order: 510,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Fire Trail": {
			order: 520,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Cold Trail": {
			order: 521,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Charged Trail": {
			order: 522,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Land Trail": {
			order: 522.01,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},

		"Glitch Trail": {
			order: 522.5,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},

		"Double Trail": {
			order: 523,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},

		"Dark Trail": {
			order: 530,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Omnipotent Trail": {
			order: 550,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Ultra Omnipotent Trail": {
			order: 550.001,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},

		"Pentagon Trail": {
			order: 540,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Catastrophic Trail": {
			order: 545,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Bronze Trail": {
			order: 560,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"atomic": {
			order: 2,
			multiX: 1,
			multiY: 1,
			dX: 0,
			dY: 0,
			gr: 3,
		},
		"Silver Trail": {
			order: 570,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Gold Trail": {
			order: 580,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Paw Trail": {
			order: 590,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Troll Trail": {
			order: 590.1,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Troll Trail OG": {
			order: 590.101,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},

		"Sparkle Trail": {
			order: 600,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Accelerating Trail": {
			order: 531,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Blazing Trail": {
			order: 532,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Steam Trail": {
			order: 533,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Drunk Trail": {
			order: 534,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},
		"Developer Trail": {
			order: 238943742983,
			multiX: 0,
			multiY: 0,
			dX: 0,
			dY: 0,
			gr: 1,
		},

		//outline
		"Bouncy": {
			order: 31,
			multiX: 0.96,
			multiY: 0.96,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Metallic Blur": {
			order: 32,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Gold Blur": {
			order: 33,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Diamond Blur": {
			order: 36,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Ruby Blur": {
			order: 34,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Emerald Blur": {
			order: 35,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Sakura Blur": {
			order: 38,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Overlord Blur": {
			order: 39,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Inception Blur": {
			order: 999999999,
			multiX: 20,
			multiY: 20,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Enemy Outline": {
			order: -1,
			multiX: 1.015,
			multiY: 1.015,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Radiating Enemy Outline": {
			order: -0.9,
			multiX: 2.015,
			multiY: 2.015,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Extra Radiating Enemy Outline": {
			order: -0.8,
			multiX: 2.015,
			multiY: 2.015,
			dX: 0,
			dY: 0,
			gr: 2
		},

		"Universal Master": {
			order: 40,
			multiX: 2,
			multiY: 2,
			dX: 0,
			dY: 0,
			gr: 2,
			hidden: true
		},
		"Deity Aura": {
			order: 39.9,
			multiX: 3,
			multiY: 3,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Climate Aura": {
			order: 39.99,
			multiX: 3,
			multiY: 3,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Water Enemy Aura": {
			order: 39.999,
			multiX: 3,
			multiY: 3,
			dX: 0,
			dY: 0,
			gr: 2,
			hidden: true
		},
		"Crazy Aura": {
			order: 39.95,
			multiX: 3,
			multiY: 3,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Amogus Outline": {
			order: 40.01,
			multiX: 6,
			multiY: 6,
			dX: 0,
			dY: 0,
			gr: 2
		},
		"Ultraviolet Radiation": {
			order: 40.005,
			multiX: 3,
			multiY: 3,
			dX: 0,
			dY: 0,
			gr: 2,
			hidden: true
		},

	}
};

let heroList = document.querySelector(".heroList").children;

for (let i of heroList) {
	let children = i.children;
	for (let j of children) {
		if (j.id == i.id + "Tooltip") {
			let children2 = j.children;
			for (let k of children2) {
				if (k.className == "abilityone") {
					CONSTANTS.heroes[i.id].a1desc = k.innerText.trim().replace(/[\n\t]+/, "");
				} else if (k.className == "abilitytwo") {
					CONSTANTS.heroes[i.id].a2desc = k.innerText.trim().replace(/[\n\t]+/, "");
				}
			}
		}
	}
}

Object.freeze(CONSTANTS);

const victoryTexts = Object.freeze({
	"Corrupted Core": {
		"-1": ["What starts must"],
		"-2": ["end, but what ends"],
		"-3": ["might start."],
		"-4": ["16 17 306"],
		"-20": ["there's nothing here. go back."],
		"-40": ["what are you doing"],
		"-60": ["why though"],
		"-80": ["i told you there's nothing just stop"],
		"-100": ["ok whatever waste your time then"],
		"-120": ["seriously its not funny anymore"],
		"-140": ["0 VP awarded!", "litearlly nothing lol stop wasting ur time"],
		"-160": ["whats the point you don't gain anything"],
		"-180": ["seriously just leave or something idk"],
		"-200": ["litearlly stop you're not supposed to be here"],
		"-230": ["there's nothing ahead of you. cease and desist."],
		"-260": ["stop. just stop."],
		"-300": ["ok ok fine ill give you something", null, "Negative Hat"],
		"-500": ["there's seriously nothing more I promise"],
		"-1000": ["do you have a life"],
		"-2000": ["ok you don't I guess"],
		"-3000": ["honestly what even is life"],
		"-4000": ["how long did this even take"],
		"-5000": ["welp the messages end here... have fun. you wasted a lot of time."],
		"-100000": ["sup, nice hacks"],
		"41": ["The corruption continues. 2 VP awarded!", "Parvulus"],
		"81": ["You have beaten the corrupted enemies. 3 VP awarded!", "Gizmo"]
	},
	"Endless": {
		"41": ["Have a rest."],
		"81": ["The possibilities are endless."],
		"121": ["Infinite growth."],
		"161": ["Ceaselessly impossible."],
		"201": ["Boundless world."],
		"241": ["Eternal enemies."],
		"281": ["Permeating Perpetuity."],
		"321": ["Have a rest."],
	},
	"Immoral Inferno": {
		"21": ["Less predictable than you think... 2 VP awarded!"]
	},
	"Boss Brawl": {
		"41": ["Oh no, what's happening... 2 VP awarded!"],
		"52": ["circles look so wrong"],
		"61": ["At least collisions aren't garbage unlike Geometry Dash"],
		"80": ["Welcome to the FINAL BOSS. Biggest enemy in the entire game."],
		"81": ["You survived trauma. 3 VP awarded!"]
	},
	"Snail Salon": {
		"1": ["Welcome to Snail Salon"],
		"2": ["We're all snails here"],
		"4": ["Don't get carried away"],
		"6": ["How does it feel to be snail"],
		"10": ["Have a breather"],
		"11": ["It's getting pretty steamy"],
		"13": ["Don't suffocate"],
		"21": ["You feel refreshed as you leave the steamy salon. 2 VP awarded!", "Quetzal"]
	},
	"Snail Salon Hard": {
		"1": ["Welcome to Snail Salon Hard"],
		"2": ["We're hardly snails here"],
		"4": ["You should hardly get carried away"],
		"6": ["The wind hardly does anything, so we're introducing Ultra Wind!"],
		"10": ["This is hardly a breather"],
		"11": ["It's hardly steamy"],
		"13": ["Tip: You should hardly suffocate"],
		"16": ["Now you can hardly breathe in the whole area"],
		"17": ["The red steam is extremely potent. You should hardly stay in it."],
		"20": ["Avoid as much as you can. You should hardly stop."],
		"21": ["You hardly feel refreshed as you leave the steamy salon. 6 VP awarded!", "Quetzal", "Steam Trail"]
	},

	"Breezy Bounce": {
		"11": ["Don't be having too much fun"],
		"21": ["You're a true athlete! 1 VP awarded!"],
	},
	"Breezy Bounce Hard": {
		"11": ["I love bouncing!!!"],
		"21": ["Your resilience is astonishing! 5 VP awarded!", null, "Bouncy"],
	},
	"Present Parade": {
		"22": ["Happy new years! 4 VP awarded!"],
	},
	"Heroic Holiday": {
		"22": ["ERROR 404 - Map Found... wait what? 2 VP awarded!"]
	},
	"Permeating Perpetuity": {
		"3": ["Take a break"],
		"5": ["It will be over soon"],
		"7": ["Is this the end?"],
		"8": ["The evanescence of perpetuity... 2 VP awarded!"]
	},
	"Permeating Perpetuity Hard": {
		"3": ["Hardly take a break"],
		"5": ["It will hardly be over soon"],
		"7": ["Is this the end? Hardly so..."],
		"8": ["Hardly the evanescence of perpetuity... 4 VP awarded!"]
	},
	"Terrifying Tomb": {
		"1": ["You shouldn't be here..."],
		"2": ["Leave."],
		"4": ["This tomb is cursed. Please turn back."],
		"5": ["You were warned."],
		"6": ["If you came, why don't you stay?"],
		"7": ["Here you will stay, forever trapped... 1 VP awarded!"]
	},
	"Terrifying Tomb Hard": {
		"1": ["You should hardly be here..."],
		"2": ["Leave, or you will hardly survive."],
		"4": ["This tomb is cursed. It's too late. Hardly turn back."],
		"5": ["You were hardly warned."],
		"6": ["If you came, why don't you stay? It's hardly scary."],
		"7": ["Your screams are hardly heard. 7 VP awarded!", null, "Death"]
	},

	"Toilsome Traverse": {
		"41": ["The journey has only begun. 3 VP awarded", "Heusephades"],
		"81": ["Can you see the stars? 7 VP awarded!", "Thoth"]
	},
	"Crazy Cosmos": {
		"41": ["The craziness is behind you. 2 VP awarded!", "Cimex"]
	},
	"i eat idiot": {
		"1": ["Warning, this map may cause epilepsy."],
		"8": ["Let's speed it up a little, shall we?"],
		"15": ["Your brain is slowly dying..."],
		"22": ["Ok enough of that, take a break from spinning."],
		"28": ["Death fills the air."],
		"29": ["You are what you eat. 4 VP awarded!", null, "Clown Hat"]
	},
	"Glamorous Glacier": {
		"41": ["You fall into the cracks and your path narrows. 3 VP awarded!"],
		"81": ["You survived the bitter cold. 4 VP awarded!", "Floe"]
	},
	"Glamorous Glacier Hard": {
		"41": ["Your future looks bleak. 6 VP awarded!"],
		"81": ["You hardly survived the bitter cold. 9 VP awarded!", "Floe", "Cold Trail"]
	},

	"Amaster Atmosphere": {
		"8": ["CENT. 2 VP awarded!"]
	},
	"exit the sus amogus": {
		"41": ["The start of a long journey. 4 VP awarded!"],
		"81": ["Do you regret your decisions? 12 VP awarded!"],
		"120": ["The last stand."],
		"121": ["You are no longer suspicious. 36 VP awarded!", null, "Crewmate Hat"]
	},
	"Roving Road": {
		"1": ["Blue balls only kill you if you're moving"],
		"11": ["Orange balls only kill you if you're stationary"],
		"41": ["The enemies tremble with energy. 7 VP awarded!", "Kamino"]
	},
	"Speculative Stratosphere": {
		"11": ["The ultraviolet radiation dwindles. 5 VP awarded!"]
	},
	"Speculative Stratosphere Hard": {
		"11": ["The ultraviolet radiation hardly dwindles. 11 VP awarded!", null, "Ultraviolet Radiation"]
	},

	"Insidious Invasion": {
		"21": ["You survived the first round of invasive assasins. 3 VP awarded!"],
		"41": ["The battle was a tough one, but you won. GG! 7 VP awarded!", null, "Sunglasses"],

	},
	"Crazy Cosmos Hard": {
		"40": ["The steam is 325 speed. Fastest enemy in the canon game."],
		"41": ["The craziness is hardly behind you. 6 VP awarded!", "Cimex", "Crazy Aura"]
	},
	"Wistful Warping": {
		"21": ["They always look for opportunities... 1 VP awarded!", "Janus"],
		"41": ["You have mastered the teleportation. 2 VP awarded!", "Verglas"]
	},
	"Wistful Warping Hard": {
		"21": ["They hardly look for opportunities... 4 VP awarded!", "Janus"],
		"41": ["You have hardly mastered teleportation. 6 VP awarded!", "Verglas", "Warp Hat"]
	},

	"Tired Tavern": {
		"21": ["The quick hero jumps over the lazy enemies. 3 VP awarded!", "Cellator"]
	},
	"Monochrome Mission": {
		"21": ["There is no life in this map.. 6 VP awarded!", "Panzer"]
	},
	"Monochrome Mission Hard": {
		"21": ["There is hardly any life in this map.. 19 VP awarded!", "Panzer", "Yin Yang"]
	},

	"Hypnotic Hill": {
		"21": ["Now you are a magnet, attracting enemies.. 1 VP awarded!"],
		"41": ["You have mastered the art of attraction and repulsion. 3 VP awarded!", "Magno"],
	},
	"Hypnotic Hill Hard": {
		"21": ["Now you are hardly a magnet, attracted to outside forces... 5 VP awarded!"],
		"41": ["You have hardly mastered attraction and repulsion. 12 VP awarded!", "Magno", "Hypnotic Hat"],
	},

	"Mouse Mastery": {
		"11": ["You're pretty good at mouse!"],
		"16": ["Good luck on these next areas!"],
		"21": ["You are a legendary mouse master! 2 VP awarded!"]
	},
	"Keyboard Kingdom": {
		"17": ["Wait.. there's more..."],
		"21": ["🧀🐀. The breeze kills the mice. 10 VP awarded!"],
	},
	"Cryptic Corridor": {
		"36": ["They were too late to stop you."],
		"41": ["It's too late to escape... 5 VP awarded!", null, "Omnipotent Trail"]
	},
	"Cryptic Corridor Hard": {
		"36": ["They were hardly too late to stop you."],
		"41": ["There is hardly an escape now... 13 VP awarded!", null, "Ultra Omnipotent Trail"]
	},

	"Crowded Cavern": {
		"41": ["The Crowded Cavern beckons you on. 2 VP awarded!", "Neuid"],
		"81": ["You have squeezed your way through the cavern. 3 VP awarded!", "Kindle"]
	},
	"Crowded Cavern Hard": {
		"41": ["The Crowded Cavern hardly beckons you on. 4 VP awarded!", "Neuid"],
		"81": ["You have hardly squeezed your way through the cavern. 6 VP awarded!", "Kindle", "Double Trail"]
	},
	"could be a map": {
		"1": ["there is no map, don't play this"],
		"6": ["why are you still here"],
		"10": ["how unfortunate"],
		"11": ["oh look its black now"],
		"12": ["just why"],
		"13": ["oh look its amogus how funny"],
		"14": ["yeah more amogus yeah have a problem"],
		"16": ["theres nothing more just stop"],
		"17": ["im telling you theres nothing here"],
		"18": ["how depressing"],
		"20": ["oh no anyways"],
		"21": ["congrats you wasted your time, no vp awarded"],
		"306": ["oh look you finally found out"],
		"308": ["lol u ded."],
		"309": ["imagine not having the correct heroes"],
		"310": ["lol theres still no vp imagine"],
		"1333": ["youre smarter than i thought"],
		"1334": ["you can die now though"],
		"1335": ["seriously"],
		"1336": ["how unfortunate (v2)"],
		"1337": ["you still wasted your time... or not? gg doe"]
	},
	"become sus": {
		"2": ["why is it dark lol"],
		"4": ["the trolling has begun"],
		"6": ["dude become sus is actually sus no way"],
		"8": ["touhou players where you at bro"],
		"9": ["worlds hardest game players where you at bro"],
		"10": ["careful now"],
		"11": ["You have became SUS. 2 VP awarded!", "Felony"],
	},
	"become sus hard": {
		"2": ["why is it hardly dark lol"],
		"4": ["the trolling has truly begun"],
		"6": ["dude become sus hard is actually sus (obviously)"],
		"8": ["touhou players cant even pass this"],
		"9": ["desync is funny lol"],
		"10": ["being careful wont help lol"],
		"11": ["You have became extra SUS. 5 VP awarded!", "Felony", "Drunk Trail"],
	},
	"become sus insane": {
		"1": ["Warning - This map is unfair."],
		"11": ["You have became truly SUS. 69 VP awarded!", "Felony", "Amogus Outline"],
	},

	"enter the sus amogus": {
		"1": ["you're going to want a team."],
		"11": ["2 VP awarded!"],
		"20": ["Death fills the air."],
		"21": ["I HATE AMONG US!!! 20 VP awarded!", null, "Amogus Hat"]
	},
	"The Tetar Trials": {
		"21": ["Skill issue. 3 VP awarded!"]
	},
	"Euclid Empire": {
		"1": ["Who's this?"],
		"2": ["Welcome challenger.."],
		"3": ["Say hello to my pit trap, it's over for you!"],
		"4": ["Oh I see, you think you're clever"],
		"5": ["You're not"],
		"6": ["Don't think you're worthy yet, you got lucky"],
		"7": ["Watch your step"],
		"8": ["Let's raise the stakes"],
		"9": ["Not everything in life will come easy"],
		"10": ["It looks like you'll be stuck here"],
		"11": ["Ha, what are you gonna do now?"],
		"12": ["Enough with the games, you're doomed"],
		"13": ["How.. how do you have so much power?"],
		"14": ["No..."],
		"15": ["Your legend will not be forgotten. 2 VP Awarded!"],
		"21": ["Hope that was satisfying. 2 VP Awarded!"],

	},
	"Methodical Monastery": {
		"41": ["Your training has just begun... 4 VP awarded!", "Ptah"]
	},
	"Methodical Monastery Hard": {
		"41": ["We will meet again at tomorrow's sunset...  9 VP awarded!", "Ptah", "Deity Aura"]
	},
	"Atrocious Arena": {
		"41": ["A grander arena awaits. 3 VP awarded!", "Turr"],
		"81": ["You survived the deadly arena. 5 VP awarded!", "Torpedo"]
	},
	"Arduous Abyss": {
		"41": ["The dark abyss swallows you whole. 4 VP awarded!", null, "Devil Hat"]
	},

	"Strange Space": {
		"21": ["The strange enemies have been defeated. 2 VP awarded!", "Orbital"]
	},
	"Scorching Shaft": {
		"41": ["It's quite hot in here. 2 VP awarded!"],
		"81": ["You survived the flames. 3 VP awarded!", "Scoria"],
	},
	"Scorching Shaft Hard": {
		"41": ["It's so hot in here, you hardly made it. 6 VP awarded!"],
		"81": ["You hardly survived the excruciating heat. 8 VP awarded!", "Scoria", "Blazing Trail"],
	},

	"Accelerating Aisle": {
		"41": ["You are truly a master of speed. 2 VP awarded!", "Anuket"],
	},
	"Accelerating Aisle Hard": {
		"41": ["You are hardly a master of speed. 6 VP awarded!", "Anuket", "Accelerating Trail"],
	},

	"Monumental Migration+": {
		"41": ["Don't mess with these evil enemies. 1 VP awarded!"],
		"81": ["The path remains calm, for now. 3 VP awarded!"],
		"121": ["Whatever you do, do not proceed. 4 VP awarded!"],
		"161": ["Turn back before it is too late. 3 VP awarded!"],
		"201": ["It will be over soon.. 7 VP awarded!"],
		"240": ["Reality has ended."],
		"241": ["You are truly a legend. 24 VP awarded!", undefined, "Cowboy Hat"]
	},
	"Monumental Migration+ OG": {
		"1": ["This is the OG version of MM+"],
		"2": ["Shown here is the state of MM+ on release"],
		"3": ["The map later recieved a revamp into its current state"],
		"4": ["This is for historical purposes only. Does not give rewards."]
	},

	"Monumental Migration": {
		"2": ["This is a carbon copy of MM from Evades.io"],
		"3": ["It's here to compare hero strengths between the games"],
		"41": ["1 VP awarded!"],
		"81": ["2 VP awarded!"],
		"121": ["2 VP awarded!"],
		"161": ["2 VP awarded!"],
		"201": ["3 VP awarded!"],
		"241": ["3 VP awarded!"],
		"281": ["3 VP awarded!"],
		"321": ["4 VP awarded!"],
		"361": ["5 VP awarded!"],
		"401": ["3 VP awarded!"],
		"441": ["4 VP awarded!"],
		"481": ["Take care. 48 VP awarded!"],

	},
	"Daunting Dimension": {
		"41": ["There are dark days ahead. 6 VP awarded!"],
		"81": ["I hope you don't mind going to space. 6 VP awarded!", "Umbra"],
		"121": ["It's dark here. 6 VP awarded!", null, "Dark Trail"],
	},
	"Daunting Dimension Hard": {
		"41": ["Only darkness awaits you ahead. 10VP awarded!"],
		"81": ["The darkness of outer space fills everything around. 16VP awarded!", "Umbra"],
		"121": ["It's too dark here, you feel the full weight of the air. 23VP awarded!", null, "Dark Hat"],

	},
	"Catastrophic Core": {
		"41": ["The catastrophic damage cannot be undone. 8 VP awarded!", null, "Catastrophic Trail"],
	},
	"Cataclysmic Catastrophe": {
		"11": ["mom im scared 😢😢"],
		"16": ["You escaped the apocalypse. h vp awarded!"],
		"21": ["((d/dx 90x^2)/(x) * integral xsin(3x) from 0 to pi/2) VP awarded!", "april fools lol you dont get a hero", "Troll Trail OG"]
	},
	"PENTAGONIS": {
		"28": ["imagine if you fail this lol"],
		"29": ["Pixel Perfect. 14 VP awarded!", null, "Pentagon Trail"]
	},
	"Easy Evasion": {
		"21": ["Congratulations! Good luck on your future endeavors. 1 VP awarded!"]

	},
	"Easy Evasion Hard": {
		"21": ["So is this easy Evasion or Evasion hard? We hardly know. 3 VP awarded!", null, "Enemy Outline"]

	},
	"Easy Evasion Insane": {
		"21": ["This is far from easy. 7 VP awarded!", null, "Radiating Enemy Outline"]
	},
	"Easy Evasion Extreme": {
		"21": ["Having shown your extreme ability, you can rest now. 11 VP awarded!", null, "Extra Radiating Enemy Outline"]
	},

	"Neko Nightmare": {
		"2": ["The Neko.."],
		"3": ["Of This Story.."],
		"4": ["Is Not.."],
		"5": ["An Ordinary One."],
		"6": ["He was always.."],
		"7": ["Busy with work.."],
		"8": ["And never.."],
		"9": ["Had any free.."],
		"10": ["Time to spend.."],
		"11": ["With others. 1 VP awarded!"],
		"12": ["Besides.."],
		"13": ["He was.."],
		"14": ["Greatly alarmed."],
		"15": ["He knew.."],
		"16": ["That someone.."],
		"17": ["Was following.."],
		"18": ["Him."],
		"19": ["His instincts.."],
		"20": ["Told him.."],
		"21": ["About the danger. 2 VP awarded!"],
		"22": ["In one.. "],
		"23": ["Ordinary day.."],
		"24": ["He walked home.."],
		"25": ["From work."],
		"26": ["He was stressed.."],
		"27": ["After a day.. "],
		"28": ["At work."],
		"29": ["With his.."],
		"30": ["Keen cat hearing,.."],
		"31": ["Нe heard footsteps.. 3 VP awarded!"],
		"32": ["Behind him."],
		"33": ["He was surprised,.."],
		"34": ["Because at.."],
		"35": ["This time.."],
		"36": ["The streets are.."],
		"37": ["Deserted and dark."],
		"38": ["He didn’t have time.."],
		"39": ["To come to his senses.."],
		"40": ["As he understood...."],
		"41": ["Waky waky, time to go to the school! 4 VP awarded!", "Neko", "a qt Neko Hat"],
	},
	"Neko Nightmare Original": {
		"2": ["The Neko.."],
		"3": ["Of This Story.."],
		"4": ["Is Not.."],
		"5": ["An Ordinary One."],
		"6": ["He was always.."],
		"7": ["Busy with work.."],
		"8": ["And never.."],
		"9": ["Had any free.."],
		"10": ["Time to spend.."],
		"11": ["With others. 1 VP awarded!"],
		"12": ["Besides.."],
		"13": ["He was.."],
		"14": ["Greatly alarmed."],
		"15": ["He knew.."],
		"16": ["That someone.."],
		"17": ["Was following.."],
		"18": ["Him."],
		"19": ["His instincts.."],
		"20": ["Told him.."],
		"21": ["About the danger. 4 VP awarded!"],
		"22": ["In one.. "],
		"23": ["Ordinary day.."],
		"24": ["He walked home.."],
		"25": ["From work."],
		"26": ["He was stressed.."],
		"27": ["After a day.. "],
		"28": ["At work."],
		"29": ["With his.."],
		"30": ["Keen cat hearing,.."],
		"31": ["Нe heard footsteps.. 8 VP awarded!"],
		"32": ["Behind him."],
		"33": ["He was surprised,.."],
		"34": ["Because at.."],
		"35": ["This time.."],
		"36": ["The streets are.."],
		"37": ["Deserted and dark."],
		"38": ["He didn’t have time.."],
		"39": ["To come to his senses.."],
		"40": ["As he understood...."],
		"41": ["Waky waky, time to go to the school! 15 VP awarded!", "Neko", "a qt Neko Hat"],
	},
	"Little Land": {
		"21": ["This land ceases to seem small. 1 VP awarded!"],
		"41": ["You survived the strange little island. 5 VP awarded!", "Dendo"],
	},
	"Little Land Hard": {
		"21": ["This land hardly ceases to seem small. 3 VP awarded!"],
		"41": ["You hardly survived the strange lo- I mean, little island. 11 VP awarded!", "Dendo", "Land Trail"],
	},

	"Heoric Holiday": {
		"5": ["hello person who's looking in the code"],
	},
	"Peaceful Plains": {
		"1": ["Have fun!"],
		"41": ["All that's left is void. 3 VP awarded.", null, "Glitch Trail"]
	},
	"Furious Fraud": {
		"2": ["The foreboding breeze warns you to turn back."],
		"5": ["PREPARE TO BE DRIVEN INSANE"],
		"11": ["Let's up the pain a little, shall we?"],
		"21": ["It only gets worse."],
		"31": ["Welcome to the heart of lava! NOW DIE!"],
		"40": ["You can't give up now..."],
		"41": ["Freedom awaits you. 7 VP awarded!", null, "Fire Trail"]
	},
	"PENTAGONIS": {
		"28": ["imagine if you fail this lol"],
		"29": ["Pixel Perfect. 14 VP awarded!", null, "Pentagon Trail"]
	},
	"Depressive Dungeon": {
		"2": ["Let's explore the dungeon!"],
		"20": ["This... is boring."],
		"21": ["1 VP awarded!"],
		"40": ["Why did i even come here.."],
		"41": ["2 VP awarded!", null, "Bear"],
		"42": ["Oh no, I fell somewhere, lets head back, I'm scared!"],
		"43": ["I should've stayed home!"],
		"46": ["how do i get through..., can't even use my ability here."],
		"51": ["This pressure makes me weak."],
		"61": ["It was so... powerful.. 2 VP awarded!"],
		"70": ["I'm getting hallucinations"],
		"81": ["I feel the fresh air!"],
		"82": ["Lets go right."],
		"83": ["I see the exit! 2 VP awarded!", null, "Paw Trail"],
	},
	"Ultimate Universe": {
		"1": ["You're in for a long journey."],
		"21": ["There's a long way to go. 0 VP awarded!"],
		"41": ["Take the exit, then keep right. 1 VP awarded!"],
		"61": ["Let's go to the wilderness. 2 VP awarded!"],
		"81": ["What's this trail? 1 VP awarded!"],
		"101": ["The area becomes deserted. 2 VP awarded!"],
		"121": ["You now master land. The skies are next. 3 VP awarded!", "Paladin"],
		"141": ["It's getting quite cold. 1 VP awarded!"],
		"161": ["Should've brought a thicker jacket. 2 VP awarded!"],
		"181": ["To the skies we go! 3 VP awarded!"],
		"201": ["This is a little too far up... 3 VP awarded!"],
		"221": ["Now we fall back down. 3 VP awarded!"],
		"241": ["Mastering the sky, you now aim to conquer hell itself. 4 VP awarded!", "Seiun"],
		"261": ["Now we plunge into darkness. 2 VP awarded!"],
		"281": ["Thinks get weird now. 4 VP awarded!"],
		"301": ["The universe is not happy with you... 3 VP awarded!"],
		"321": ["Now fight! 5 VP awarded!"],
		"341": ["Good luck on the final stretch. 6 VP awarded!"],
		"351": ["Don't screw it up now."],
		"361": ["You are truly a legendary hero. 20 VP awarded!", "Celestial", "Universal Master"],

		"88": ["The red slows you down."],
		"91": ["The cyan speeds you up."],
		"93": ["Keyboard is heavily suggested for this area."],
		"220": ["Warning! Don't get sucked into the black hole!"],
		"311": ["Warning! Invisible assasins! Take caution!"],

	},
	
	"Ultimate Universe Hard": {
		"1": ["You're hardly in for a long journey."],
		"21": ["There's hardly a long way to go. 1 VP awarded!"],
		"41": ["Take the hard exit, then keep right. 2 VP awarded!"],
		"61": ["Let's hardly go to the wilderness. 4 VP awarded!"],
		"81": ["What's this hard trail? 2 VP awarded!"],
		"101": ["The area becomes hardly deserted. 4 VP awarded!"],
		"121": ["You now hardly master land. The skies are next. 6 VP awarded!", "Paladin"],
		"141": ["It's getting hardly cold. 2 VP awarded!"],
		"161": ["Should've brought a harder jacket. 4 VP awarded!"],
		"181": ["To the skies we hardly go! 6 VP awarded!"],
		"201": ["This is hardly too far up... 6 VP awarded!"],
		"221": ["Now we hardly fall back down. 6 VP awarded!"],
		"241": ["Mastering the sky, you now aim to hardly conquer hell itself. 8 VP awarded!", "Seiun"],
		"261": ["Now we hardly plunge into darkness. 4 VP awarded!"],
		"281": ["Thinks hardly get weird now. 8 VP awarded!"],
		"301": ["The universe is hardly not happy with you... 6 VP awarded!"],
		"321": ["Now fight hard! 10 VP awarded!"],
		"341": ["Hardly have luck on the final stretch. 12 VP awarded!"],
		"351": ["Hardly screw it up now."],
		"361": ["You are truly a hard hero. 50 VP awarded!", "Celestial", "Universal Master"],

		"88": ["The red hardly slows you down."],
		"91": ["The cyan hardly speeds you up."],
		"93": ["Keyboard is hardly suggested for this area."],
		"220": ["Warning! Hardly get sucked into the black hole!"],
		"311": ["Warning! Invisible assasins! Hardly take caution!"],

	},
	"Oblique Oblivion": {
		"8": ["Well, you won. You got 2 VP. But in reality, it doesn't matter."],
		"41": ["Ok good job, now solo it. 5 VP awarded!"],

	},
	"Calamitic Coliseum": {
		"13": ["You won. 10 VP awarded!", null, "Helmet"],

	},
	"Vacant Voltage": {
		"41": ["The static electricity crackles. 3 VP awarded!", "Electrode", null],

	},
	"Vacant Voltage Hard": {
		"41": ["The static electricity hardly crackles. 17 VP awarded!", "Electrode", "Charged Trail"],

	},
	"Chaotic Climate": {
		"21": ["Well that was quite a plot twist. 5 VP awarded!", null, "Climate Aura"],

	},
	"Impossible Isle": {
		"1": ["Warning - Unfair & Luck Based"],
		"2": ["Why are you still here? It's IMPOSSIBLE!"],
		"3": ["Oh, I see. No more ability cheese."],
		"4": ["No abilities?"],
		"5": ["ENOUGH FOOLING AROUND. ITS TIME..."],
		"6": ["...THAT I RELEASE..."],
		"7": ["...MY ULTIMATE..."],
		"8": ["...WEAPON..."],
		"9": ["...YOURE NOT READY..."],
		"10": ["NOW DIE!!!!!!!!!!!!!!!!!!!!!"],
		"11": ["HUH!?!?!?!?!?!?!?!?!"],
		"12": ["LETS TRY THAT AGAIN!!!!"],
		"13": ["... You know, cheating is not funny."],
		"14": ["Oh well. Take your cheated prize when you win."],
		"15": ["I give up."],
		"16": ["WHAT?!? HOW DID YOU NOT FALL FOR IT?"],
		"17": ["You're dead anyways. Idc."],
		"18": ["No more trolls. Have fun!"],
		"19": ["JUST KIDDING!!"],
		"20": ["LOL YOU DIE!!"],
		"21": ["NOOOO WHAT!!?!?! ∞ VP awarded! (sideways)", null, "Troll Trail"],

	},
	"Wicked War": {
		"21": ["The enemies are calling for reinforcement. 4 VP awarded!"],
		"22": ["These auras make balls immune"],
		"31": ["These snipers shoot homing bullets"],
		"41": ["You've won the war. 14 VP awarded!", "Sicario"],

	},
	"Wicked War Hard": {
		"1": ["this map is a joke and does not give rewards btw"],
	},

	"Grimly Gallows": {
		"41": ["You were lucky this time. 6 VP awarded!", "Megarim"],

	},
	"Lazy Labyrinth": {
		"20": ["Oops, you woke up the enemies"],
		"21": ["You did not succumb to laziness. 3 VP awarded!"]
	},
	"Perilous Planetarium": {
		"29": ["Stars in the palm of your hand, you are enveloped in a slight cold. 4 VP!"]
	},
	"Lifeless Laboratory": {
		"2": ["There are a lot of broken flasks and spilled liquids on the floor.."],
		"3": ["This place was a wonderful and beautiful laboratory."],
		"4": ["Until the moment, when the core was created..."],
		"5": ["Many experiments were mutated under the influence of the nucleus"],
		"6": ["Many years have already passed. The laboratory became habitable"],
		"7": ["It seems to be one of the mutated experiments!"],
		"8": ["Too many liquids = too hard to move."],
		"11": ["These beasts are very similar to mutanted frogs."],
		"14": ["So many frogs!"],
		"15": ["Oh no, this place is flooded with water and full of snakes."],
		"16": ["Too hard to move under the weight of all this water."],
		"17": ["Cannot use abilities while you are in a flooded area."],
		"21": ["This huge mother of snakes! You have to be extremely careful."],
		"21": ["Finally, we left the flooded areas."],
		"22": ["Quite long corridors..."],
		"23": ["I think these corridors will lead us to the core."],
		"27": ["It looks like the path is blocked. Climb through the ventilation."],
		"28": ["The core is damaged! Gotta run for the exit!!!"],
		"29": ["You've run away from the explosion, but something terrible is coming..."],
		"31": ["You managed to escape from this Lifeless Laboratory. Be calm for now. 13 VP!"],
		"Abandoned room 2": ["The room has a secret experimental hero... 1 VP!", "Tycoveka"],
	},
	"Watery Water": {
		"21": ["Oh no, it's becoming hydroxic acid. 2 VP awarded!"],
		"23": ["Why did you add water to acid? Now it's boiling to steam..."],
		"31": ["Quick - add some ice!"],
		"41": ["You conquered Dihydrogen Monoxide. 3 VP awarded!"],

	},
	"Watery Water Hard": {
		"21": ["Oh no, it's hardly becoming hydroxic acid. 4 VP awarded!"],
		"23": ["Why did you hardly add water to acid? Now it's boiling to steam..."],
		"31": ["Quick - hardly add some ice!"],
		"41": ["It's been a fun ride with ya'll. 6 VP awarded!", null, "Water Enemy Aura"],
	},
	"Volcanic Village": {
		"21": ["Village passed, now climbing the volcano. 2 VP awarded!"],
		"41": ["Endless volcanic energy floods the land. 5 VP awarded", "Lavablob"],
	},
	"Atomic Alley": {
		"21": ["olol. 5 VP awarded!", null, "atomic"],
		"41": ["why bro. just why. 14 VP awarded!"]
	},
	"Endless": new Proxy({
		"1000": ["vp!<! 111"],
		"2000": ["vp!<! 222"],
		"3000": ["vp!<! 333"],
	}, {get(target, prop, receiver){
		if(prop in target) return target[prop];
		let ccc = ()=>String.fromCharCode(Math.round(Math.random() * (126-33)) + 33);
		if((prop % 10) == 0){
			return [ccc()+ccc()+ccc()+ccc()+ccc()+ccc()+ccc() +" " + ccc()+ccc()+ccc()+ccc() + `, ${Math.ceil(prop/20)} vp!`];
		}else{
			return [
				ccc()+ccc()+ccc()+ccc()
			];
		}

		return null;
	}}),
});

const crypticAreas = [
	"Corridor 1", "Corridor 2", "Corridor 3", "Corridor 4", "Corridor 5", "Corridor 6", "Corridor 7", "Corridor 8", "Corridor 9", "Corridor End BOSS", "Base 1", "Security Check 1-1", "Security Check 1-2", "Security Check 1-3", "Vault 1", "Vault 2", "Vault 3", "Vault 4", "Vault 5", "Vault End BOSS", "Base 2", "Chamber 1-1", "Chamber 1-2", "Chamber 1-3", "Chamber 1-4", "Chamber 1-5", "Chamber 2-1", "Chamber 2-2", "Chamber 2-3", "Chamber End BOSS", "Base 3", "Security Check 2-1", "Security Check 2-2", "Security Check FAILED!", "Base 4 End BOSS", "The Entrance", "Chamber of Water", "Corridor of Fire", "Room of Earth", "Vault of Air", "Victory!"
];

const toilsomeAreas = [
	"Desert 1-1", "Desert 1-2", "Desert 1-3", "Desert 1-4",
	"Oasis 1-1", "Oasis 1-2", "Oasis 1-3",
	"Desert 2-1", "Desert 2-2", "Desert 2-3",
	"Battlefield 1-1", "Battlefield 1-2", "Battlefield 1-3", "Battlefield 1-4", "Battlefield 1-5", "Battlefield 1-6",
	"Desert 3-1", "Desert 3-2", "Desert 3-3",
	"Aquifer 1-1", "Aquifer 1-2", "Aquifer 1-3", "Aquifer 1-4", "Aquifer 1-5",
	"Battlefield 2-1", "Battlefield 2-2", "Battlefield 2-3",
	"Battlefield 2-4", "Desert 4-1", "Desert 4-2", "Desert 4-3", "Desert 4-4",
	"Hallucination 1-1", "Hallucination 1-2", "Hallucination 1-3", "Hallucination 1-4",
	"Jungle 1-1", "Jungle 1-2", "Jungle 1-3", "Jungle 1-4",
	"Area 41 Victory!",
	"Storm 1-1", "Storm 1-2", "Storm 1-3", "Storm 1-4",
	"Lab 1-1", "Lab 1-2", "Lab 1-3", "Lab 1-4",
	"Jungle 2-1", "Jungle 2-2", "Jungle 2-3",
	"Battlefield 3-1", "Battlefield 3-2", "Battlefield 3-3",
	"Jungle 3-1", "Jungle 3-2", "Jungle 3-3", "Jungle 3-4",
	"Hallucination 2-1", "Hallucination 2-2", "Hallucination 2-3",
	"Rocket 1-1", "Rocket 1-2", "Rocket 1-3", "Rocket 1-4", "Rocket 1-5",
	"Space 1-1", "Space 1-2", "Space 1-3", "Space 1-4",
	"Space 2-1", "Space 2-2", "Space 2-3", "Space 2-4",
	"Hallucination 3-1", "Hallucination 3-2", "Hallucination 3-3", "Hallucination 3-4",
	"Final Boss",
	"Area 81 Victory!"
];

const toilsomeTraverseAlternateUniverseAreas = [
	"Corruption 1-1",
	"Corruption 1-2",
	"Corruption 1-3",
	"Corruption 1-4",
	"Corruption 1-5",
	"Military 1-1",
	"Military 1-2",
	"Military 1-3",
	"Military 1-4",
	"Corruption 2-1",
	"Corruption 2-2",
	"Corruption 2-3",
	"Corruption 2-4",
	"Blizzard 1-1",
	"Blizzard 1-2",
	"Blizzard 1-3",
	"Blizzard 1-4",
	"Blizzard 1-5",
	"Military 2-1",
	"Military 2-2",
	"Military 2-3",
	"Military 2-4",
	"Cave 1-1",
	"Cave 1-2",
	"Cave 1-3",
	"Glacier 1-1",
	"Glacier 1-2",
	"Glacier 1-3",
	"Glacier 1-4",
	"Cave 2-1",
	"Cave 2-2",
	"Cave 2-3",
	"Volcano 1-1",
	"Volcano 1-2",
	"Volcano 1-3",
	"Volcano 1-4",
	"Cave 3-1",
	"Cave 3-2",
	"Cave 3-3",
	"Bus Station",
	"Nightmare 1-1",
	"Nightmare 1-2",
	"Nightmare 1-3",
	"Corruption 3-1",
	"Corruption 3-2",
	"Corruption 3-3",
	"Military 3-1",
	"Military 3-2",
	"Military 3-3",
	"Prison 1-1",
	"Prison 1-2",
	"Prison 1-3",
	"Prison 1-4",
	"Prison 1-5",
	"Nightmare 2-1",
	"Nightmare 2-2",
	"Nightmare 2-3",
	"Prison 2-1",
	"Prison 2-2",
	"Abyss 1-1",
	"Abyss 1-2",
	"Abyss 1-3",
	"Abyss 1-4",
	"Abyss 1-5",
	"Abyss 1-6",
	"Abyss 1-7",
	"Hell 1-1",
	"Hell 1-2",
	"Hell 1-3",
	"Hell 1-4",
	"Nightmare 3-1",
	"Nightmare 3-2",
	"Nightmare 3-3",
	"Nightmare 3-4",
	"Hell 2-1",
	"Hell 2-2",
	"Hell 2-3",
	"Hell 2-4",
	"Corruption 4-1",
	"Corruption 4-2",
	"Void Boss",
	"Home"
];