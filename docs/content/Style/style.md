---
title: Style Samples
category: Style
author: 
---

<iframe src="{{ '/content/Style/style_frame.html' | relative_url }}"
    frameborder="0" scrolling="no" onload="resizeFrame(this)"></iframe>

<style>
    iframe {
        border: none;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    function resizeFrame(obj) {
        function applyResize() {
            obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
        }

        applyResize();
        // Adjust frame size on window resize
        window.onresize = function() {
            applyResize();
        }
    }
</script>
