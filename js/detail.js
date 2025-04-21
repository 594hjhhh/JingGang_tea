 
        document.addEventListener('DOMContentLoaded', function() {  
            const image = document.getElementById('zoomable-image');  
            const imageContainer = document.getElementById('image-container');  
            const zoomInBtn = document.getElementById('zoom-in');  
            const zoomOutBtn = document.getElementById('zoom-out');  
            const resetBtn = document.getElementById('reset');  
            const positionIndicator = document.getElementById('position-indicator');  
            const thumbnail = document.querySelector('.thumbnail-image');  
            const viewportFrame = document.getElementById('viewport-frame');  
            
            let scale = 1;  
            let posX = 0;  
            let posY = 0;  
            let isDragging = false;  
            let startX, startY, startPosX, startPosY;  
            let originalImageWidth, originalImageHeight;  
            
            // 图片加载完成后的初始化  
            image.addEventListener('load', function() {  
                originalImageWidth = image.naturalWidth;  
                originalImageHeight = image.naturalHeight;  
                resetView();  
                updateViewportFrame();  
            });  
            
            // 更新缩放状态的CSS类  
            function updateZoomedState() {  
                if (scale > 1) {  
                    image.classList.add('zoomed');  
                } else {  
                    image.classList.remove('zoomed');  
                    image.classList.remove('dragging');  
                }  
            }  
            
            // 更新图片变换  
            function updateTransform() {  
                image.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;  
                updatePositionIndicator();  
                updateViewportFrame();  
                updateZoomedState();  
            }  
            
            // 更新位置指示器  
            function updatePositionIndicator() {  
                const zoomLevel = Math.round(scale * 100);  
                let positionText = `缩放: ${zoomLevel}%`;  
                
                if (scale > 1) {  
                    const imgWidth = originalImageWidth * scale;  
                    const imgHeight = originalImageHeight * scale;  
                    const viewportWidth = imageContainer.clientWidth;  
                    const viewportHeight = imageContainer.clientHeight;  
                    
                    const visibleWidth = Math.min(viewportWidth, imgWidth);  
                    const visibleHeight = Math.min(viewportHeight, imgHeight);  
                    
                    const visiblePercentX = Math.round((visibleWidth / imgWidth) * 100);  
                    const visiblePercentY = Math.round((visibleHeight / imgHeight) * 100);  
                    
                    positionText += ` | 显示: ${visiblePercentX}%宽度 × ${visiblePercentY}%高度`;  
                }  
                
                positionIndicator.textContent = positionText;  
            }  
            
            // 更新缩略图视口框 - 优化对应关系  
            function updateViewportFrame() {  
                if (scale <= 1) {  
                    viewportFrame.style.display = 'none';  
                    return;  
                }  
                
                viewportFrame.style.display = 'block';  
                
                // 获取缩略图和容器尺寸  
                const thumbnailWidth = thumbnail.parentElement.clientWidth;  
                const thumbnailHeight = thumbnail.parentElement.clientHeight;  
                const containerWidth = imageContainer.clientWidth;  
                const containerHeight = imageContainer.clientHeight;  
                
                // 计算图片在缩放后的尺寸  
                const scaledImgWidth = originalImageWidth * scale;  
                const scaledImgHeight = originalImageHeight * scale;  
                
                // 计算图片在缩略图中的显示比例（考虑缩略图可能有黑边的情况）  
                const thumbnailImgAspect = Math.min(  
                    thumbnailWidth / originalImageWidth,  
                    thumbnailHeight / originalImageHeight  
                );  
                const displayedThumbnailWidth = originalImageWidth * thumbnailImgAspect;  
                const displayedThumbnailHeight = originalImageHeight * thumbnailImgAspect;  
                
                // 计算视窗可见区域占图片的比例  
                const visibleRatioX = Math.min(1, containerWidth / scaledImgWidth);  
                const visibleRatioY = Math.min(1, containerHeight / scaledImgHeight);  
                
                // 计算视口框的尺寸  
                const frameWidth = displayedThumbnailWidth * visibleRatioX;  
                const frameHeight = displayedThumbnailHeight * visibleRatioY;  
                
                // 计算主图可见区域的中心点相对于整个图片的位置  
                // 注意：需要考虑posX和posY是相对于容器中心的偏移  
                const visibleCenterOffsetX = -posX / scaledImgWidth;  
                const visibleCenterOffsetY = -posY / scaledImgHeight;  
                
                // 计算视口框在缩略图中的位置 (居中)  
                const frameX = displayedThumbnailWidth * (0.5 + visibleCenterOffsetX) - frameWidth / 2;  
                const frameY = displayedThumbnailHeight * (0.5 + visibleCenterOffsetY) - frameHeight / 2;  
                
                // 计算缩略图中可能的黑边偏移  
                const thumbnailOffsetX = (thumbnailWidth - displayedThumbnailWidth) / 2;  
                const thumbnailOffsetY = (thumbnailHeight - displayedThumbnailHeight) / 2;  
                
                // 最终位置需要加上黑边偏移  
                const finalFrameX = frameX + thumbnailOffsetX;  
                const finalFrameY = frameY + thumbnailOffsetY;  
                
                // 确保视口框不会超出缩略图边界  
                const clampedX = Math.max(thumbnailOffsetX,   
                                        Math.min(finalFrameX,   
                                                thumbnailOffsetX + displayedThumbnailWidth - frameWidth));  
                const clampedY = Math.max(thumbnailOffsetY,   
                                        Math.min(finalFrameY,   
                                                thumbnailOffsetY + displayedThumbnailHeight - frameHeight));  
                
                // 应用视口框样式  
                viewportFrame.style.width = `${frameWidth}px`;  
                viewportFrame.style.height = `${frameHeight}px`;  
                viewportFrame.style.left = `${clampedX}px`;  
                viewportFrame.style.top = `${clampedY}px`;  
            }  
            
            // 缩放功能 - 以图片中心为缩放点  
            function zoom(factor) {  
                const oldScale = scale;  
                scale *= factor;  
                
                // 限制缩放范围  
                scale = Math.max(0.1, Math.min(scale, 10));  
                
                // 计算新的偏移量以保持图片中心位置不变  
                const containerWidth = imageContainer.clientWidth;  
                const containerHeight = imageContainer.clientHeight;  
                
                // 计算图片在容器中的中心位置  
                const imgCenterX = containerWidth / 2 - posX;  
                const imgCenterY = containerHeight / 2 - posY;  
                
                // 计算缩放后的新偏移量  
                posX = containerWidth / 2 - imgCenterX * (scale / oldScale);  
                posY = containerHeight / 2 - imgCenterY * (scale / oldScale);  
                
                // 确保图片不会超出边界  
                constrainPosition();  
                
                updateTransform();  
            }  
            
            // 确保图片位置不会超出边界  
            function constrainPosition() {  
                if (scale <= 1) {  
                    posX = 0;  
                    posY = 0;  
                    return;  
                }  
                
                const scaledImgWidth = originalImageWidth * scale;  
                const scaledImgHeight = originalImageHeight * scale;  
                const containerWidth = imageContainer.clientWidth;  
                const containerHeight = imageContainer.clientHeight;  
                
                // 在图片比容器大的情况下限制边界  
                if (scaledImgWidth > containerWidth) {  
                    const maxPosX = (scaledImgWidth - containerWidth) / 2;  
                    posX = Math.max(-maxPosX, Math.min(posX, maxPosX));  
                } else {  
                    posX = 0; // 图片宽度小于容器，居中显示  
                }  
                
                if (scaledImgHeight > containerHeight) {  
                    const maxPosY = (scaledImgHeight - containerHeight) / 2;  
                    posY = Math.max(-maxPosY, Math.min(posY, maxPosY));  
                } else {  
                    posY = 0; // 图片高度小于容器，居中显示  
                }  
            }  
            
            // 重置视图  
            function resetView() {  
                scale = 1;  
                posX = 0;  
                posY = 0;  
                updateTransform();  
            }  
            
            // 事件监听 - 点击缩放按钮  
            zoomInBtn.addEventListener('click', () => zoom(1.2));  
            zoomOutBtn.addEventListener('click', () => zoom(0.8));  
            resetBtn.addEventListener('click', resetView);  
            
            // 鼠标滚轮缩放 - 以图片中心为缩放点  
            imageContainer.addEventListener('wheel', (e) => {  
                e.preventDefault();  
                const factor = e.deltaY < 0 ? 1.1 : 0.9;  
                zoom(factor);  
            });  
            
            // 鼠标左键拖动平移 - 确保只有在按住左键时才能拖动  
            imageContainer.addEventListener('mousedown', (e) => {  
                if (e.button === 0 && scale > 1) { // 只在左键点击且放大状态下响应  
                    e.preventDefault(); // 防止拖拽图片等默认行为  
                    isDragging = true;  
                    startX = e.clientX;  
                    startY = e.clientY;  
                    startPosX = posX;  
                    startPosY = posY;  
                    image.classList.add('dragging'); // 添加拖动状态的类  
                }  
            });  
            
            // 在整个文档上监听鼠标移动，确保即使鼠标移出图片区域也能继续拖动  
            document.addEventListener('mousemove', (e) => {  
                if (isDragging) { // 只在拖动状态下更新位置  
                    const deltaX = e.clientX - startX;  
                    const deltaY = e.clientY - startY;  
                    
                    posX = startPosX + deltaX;  
                    posY = startPosY + deltaY;  
                    
                    constrainPosition();  
                    updateTransform();  
                }  
            });  
            
            // 监听鼠标抬起事件，结束拖动状态  
            document.addEventListener('mouseup', (e) => {  
                if (e.button === 0 && isDragging) { // 只在左键释放且正在拖动时响应  
                    isDragging = false;  
                    image.classList.remove('dragging');  
                }  
            });  
            
            // 鼠标离开窗口时也结束拖动  
            document.addEventListener('mouseleave', () => {  
                if (isDragging) {  
                    isDragging = false;  
                    image.classList.remove('dragging');  
                }  
            });  
            
            // 窗口大小改变时更新  
            window.addEventListener('resize', () => {  
                constrainPosition();  
                updateTransform();  
            });  
            
            // 点击缩略图跳转到对应位置  
            thumbnail.parentElement.addEventListener('click', (e) => {  
                if (scale <= 1) return; // 只在放大状态下响应  
                
                const rect = thumbnail.parentElement.getBoundingClientRect();  
                const clickX = e.clientX - rect.left;  
                const clickY = e.clientY - rect.top;  
                
                // 获取缩略图尺寸  
                const thumbnailWidth = thumbnail.parentElement.clientWidth;  
                const thumbnailHeight = thumbnail.parentElement.clientHeight;  
                
                // 计算缩略图中图片的实际显示尺寸（考虑黑边）  
                const thumbnailImgAspect = Math.min(  
                    thumbnailWidth / originalImageWidth,  
                    thumbnailHeight / originalImageHeight  
                );  
                const displayedThumbnailWidth = originalImageWidth * thumbnailImgAspect;  
                const displayedThumbnailHeight = originalImageHeight * thumbnailImgAspect;  
                
                // 计算缩略图中的黑边偏移  
                const thumbnailOffsetX = (thumbnailWidth - displayedThumbnailWidth) / 2;  
                const thumbnailOffsetY = (thumbnailHeight - displayedThumbnailHeight) / 2;  
                
                // 确保点击位置在图片区域内  
                if (clickX < thumbnailOffsetX ||   
                    clickX > thumbnailOffsetX + displayedThumbnailWidth ||  
                    clickY < thumbnailOffsetY ||   
                    clickY > thumbnailOffsetY + displayedThumbnailHeight) {  
                    return;  
                }  
                
                // 计算点击位置在图片中的比例  
                const clickXRatio = (clickX - thumbnailOffsetX) / displayedThumbnailWidth;  
                const clickYRatio = (clickY - thumbnailOffsetY) / displayedThumbnailHeight;  
                
                // 计算放大后的图片尺寸  
                const scaledImgWidth = originalImageWidth * scale;  
                const scaledImgHeight = originalImageHeight * scale;  
                const containerWidth = imageContainer.clientWidth;  
                const containerHeight = imageContainer.clientHeight;  
                
                // 基于点击位置计算新位置（使点击点位于视图中心）  
                posX = containerWidth/2 - clickXRatio * scaledImgWidth;  
                posY = containerHeight/2 - clickYRatio * scaledImgHeight;  
                
                constrainPosition();  
                updateTransform();  
            });  
            
            // 初始化  
            if (image.complete) {  
                originalImageWidth = image.naturalWidth;  
                originalImageHeight = image.naturalHeight;  
                updateViewportFrame();  
            }  
        });   