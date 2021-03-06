define("widget/dock", ["jquery-ui"], function(require) {
	$(function() {
		(function(e) {
			"use strict";
			e.fn.dockmenu = function(t) {
				var n = {
					width: "100%",
					background: "#fff",
					position: "fixed",
					responsive: true,
					menuPosition: "bottom",
					top: "auto",
					bottom: 0,
					left: 0,
					right: "auto",
					margin: [0, 0, 0, 0],
					padding: [0, "3%", 0, "3%"],
					showBoard: true,
					autoHide: false,
					buttons: [{}]
				},
				r = e.extend({},
				n, t),
				i = e(window),
				s = r.margin,
				o = r.padding,
				u = [],
				a = [],
				f = function(t) {
					if (t.type === "mouseenter") {
						e(this).next().addClass("nearby");
						e(this).prev().addClass("nearby");
						e(this).find("span").toggle()
					} else {
						e("#dock-menu-list li").removeClass("nearby");
						e(this).find("span").hide()
					}
				};
				return this.each(function() {
					var t = e(this);
					var n = r.menuPosition === "bottom" || r.menuPosition === "top" ? "tb": "lr";
					switch (e.type(s)) {
					case "number":
						u = [s, s, s, s];
						break;
					case "array":
						u = [s[0], s[1], s[2], s[3]];
						break
					}
					switch (e.type(o)) {
					case "number":
						a = [o, o, o, o];
						break;
					case "array":
						a = [o[0], o[1], o[2], o[3]];
						break
					}
					e("<div>").attr("id", "dock-menu-wrapper").addClass(n).css({
						position: r.position,
						top: r.top,
						bottom: r.bottom,
						right: r.right,
						left: r.left
					}).appendTo(t);
					var l = t.find("#dock-menu-wrapper");
					e("<ul>").attr("id", "dock-menu-list").appendTo(l);
					var c = l.find("#dock-menu-list");
					if (u.length > 0) {
						e(l).css({
							"margin-top": u[0],
							"margin-right": u[1],
							"margin-bottom": u[2],
							"margin-left": u[3]
						})
					}
					if (a.length > 0 && n === "tb") {
						e(l).css({
							"padding-top": a[0],
							"padding-right": a[1],
							"padding-bottom": a[2],
							"padding-left": a[3]
						})
					}
					if (r.autoHide) {
						var h = null;
						e(l).on("mouseleave",
						function() {
							h = setTimeout(function() {
								e(l).animate({
									opacity: 0,
									visibility: "hidden"
								},
								1e3)
							},
							5e3)
						}).on("mouseenter",
						function() {
							clearTimeout(h);
							e(this).animate({
								opacity: 1
							},
							1e3)
						})
					}
					e.each(r.buttons,
					function(t, n) {
						var r = function() {
							e(this).effect("bounce", {
								times: 3
							},
							1500);
							n.onClick();
							return false
						};
						e("<li>").attr("class", this.context).append(e("<a>").attr("href", this.href).attr("class", "appclick").attr("title", this.title).attr("app-path", this.appPath).attr("app-name", this.appName).attr("app-width", this.appWidth).attr("app-height", this.appHeight).append(e("<span>").html(this.title)).append(e("<img/>").attr("src", this.imgURL))).bind("click", this.onClick ? r: "").appendTo(c)
					});
					if (n === "tb") {
						e(l).width(r.width);
						e(c).width(r.width)
					} else {
						var p = (e(i).height() - e(c).height()) / 2;
						if (p > 0) {
							e(c).css({
								position: "absolute",
								top: p
							})
						}
						if (r.menuPosition === "left") {
							e(l).css({
								left: 0,
								right: "auto"
							})
						} else {
							e(l).css({
								right: 0,
								left: "auto"
							})
						}
					}
					if (r.showBoard && n === "tb") {
						e("<div>").addClass("menu-perspective").width(r.width).append(e("<div>").addClass("menu-board metal-gradient").css("min-width", e(c).find("li").length * e(c).find("li").width())).appendTo(l);
						e(c).css("margin-bottom", "-72px")
					} else {
						l.addClass("no-board")
					}
					if ((u.length || a.length) && n === "tb") {
						var d = e(l).outerWidth(true);
						var v = 100 - Math.round((d - e(i).width()) / e(i).width() * 100, .5);
						e(l).width(d > e(i).width() ? v + "%": r.width)
					}
					e(c).find("li").bind("mouseenter mouseleave", f)
				})
			}
		})(jQuery)

		// ajax请求后台数据
		$.ajax({
			url:config.url.dockIndex,
			type:'GET', // GET
			async:false, // 是否异步
			data:{
				path:path
			},
			dataType:'json',
			success:function(data,textStatus,jqXHR){
				if (data.status == 'success') {
					dock['buttons'] = data.data;
				} else {
					layer.msg(data.msg,{zIndex: layer.zIndex,success: function(layero){layer.setTop(layero);}});
				}
			},
			error:function(xhr,textStatus){
				console.log('错误')
			}
		});

		//定义dock
		$('#dock').dockmenu(dock);

		// dock调用程序窗口显示
		// $("#dock-menu-list").on("click",'li', function() {
		// 	id = $(this).attr('id');
		// 	$.dialog.list[id].display(true);
		// })
	});

})