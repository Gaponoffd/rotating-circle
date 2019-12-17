;(function(){
    var round = document.querySelector('.rotating-circle')

    //// выполняем функцию если существует это блок
    if(round){
        
        var roundBorderCircle = document.querySelector('.round-border-circle');
        var numberLinks = roundBorderCircle.querySelectorAll('.circle__link .number');
        var roundImgList = document.querySelector('.round-img__list');
        var emblemList = document.querySelector('.emblem-list');
        var circleItems = Array.from(document.querySelectorAll('.circle__item'));
        var directionSlide = Array.from(document.querySelectorAll('.circle__item')); /// индексы слайдов

        var angle = 0; /// начальный угол
        var step = 360 / +numberLinks.length; //// шаг в углах   
        var currentSlide = 0;  //// Текущий слайд
        var imagesArray = [];
        var textArray = [];
        var arrayForRender = [];  ////// Массив с картинками для отрисовки
        var arrayForRenderText = [];  ////// Массив текста 
        var allowToSlide = true;  //// Разрешение на перелистывание

        var TRANSITION_COF = 0.9;

        round.addEventListener('click', function(e){
            var target = e.target;
            var circleLink = target.closest('.circle__link');
            var circleItem = target.closest('.circle__item');
            
            if(circleLink){

                if (!allowToSlide) {
                    return;
                }

                var nextSlide = directionSlide.indexOf(circleItem);
                var circleItemIndex = circleItems.indexOf(circleItem);
                angle += step * circleItemIndex;

                // Вращаем сам круг
                roundBorderCircle.style.transform = 'rotate(' +angle+ 'deg)';

                // вращаем все цифры в обратную сторону
                for(var i = 0; i < numberLinks.length; i++){
                    numberLinks[i].style.transform = 'rotate(-' +angle+ 'deg)';
                }; 

                // Запрещаем перелистывание пока не закончится анимация
                allowToSlide = false;
                
                getRightDirectionAmount(currentSlide, nextSlide)
                if(nextSlide <  currentSlide){
                    getReverseDirectionAmount(nextSlide)
                } 
                render(roundImgList, emblemList, arrayForRender, arrayForRenderText);
                let transition = setTransition(circleItemIndex);
                moveSlide(roundImgList, emblemList, arrayForRender.length);         
                removeChild(roundImgList, emblemList, transition);

                // Следующий слайд становится предыдущим
                currentSlide = nextSlide;
            };

            shiftRight(circleItemIndex);
  
        })

        createInitState();
        
        /**
        * Берем из масива элементы от текущего до конца
        * @param  {number} currentSlide Текущий слайд
        * @param  {number} nextSlide Следующий слайд
        * @return {Void}
        */
        function getRightDirectionAmount(currentSlide,  nextSlide) {
            arrayForRender = [];
            arrayForRenderText = [];
            
            if (currentSlide > nextSlide) {
                nextSlide = imagesArray.length -1;
            }

            for(var i = currentSlide + 1; i <= nextSlide; i++){
                arrayForRender.push(imagesArray[i]);
                arrayForRenderText.push(textArray[i]);
            }

        }

        /**
        * Берем из масива элементы от начала и до текущего
        * @param  {number} nextSlide Следующий слайд
        * @return {Void}
        */
        function getReverseDirectionAmount(nextSlide){
            for(var i = 0; i <= nextSlide; i++){
                arrayForRender.push(imagesArray[i]);
                arrayForRenderText.push(textArray[i]);
            }
        }

        /**
        * Добавляем картинки в массив 
        * @param  {Array} arrayForRender массив для рендеринга картинок
        * @param  {Array} arrayForRenderText массив для рендеринга блока с текстом
        * @param  {Object} parentImageNode Родитель для картинкок
        * @param  {Object} parentTextNode Родитель для блока с текстом
        * @return {Void}
        */
        function render(parentImageNode, parentTextNode, arrayForRender, arrayForRenderText){
            parentImageNode.append(...arrayForRender);
            parentTextNode.append(...arrayForRenderText);
        }

        /**
        * Двигаем слайдер на нужное количесво %
        * @param  {Object} parentImageNode Родитель для картинкок
        * @param  {Object} parentTextNode Родитель для блока с текстом
        * @return {number} numberSlide номер слайдера
        */
        function moveSlide(parentImageNode, parentTextNode, numberSlide){
            var topPosition = numberSlide * 100;
            parentImageNode.style.transform = `translateY(-${topPosition}%)`;
            parentTextNode.style.transform = `translateY(-${topPosition}%)`;
        };

        /**
        * После завершения анимации обнуляем параметры  
        * @param  {Object} parentImageNode Родитель для картинкок
        * @param  {Object} parentTextNode Родитель для блока с текстом
        * @param  {number} timeout Время анимации
        * @return {Void}
        */
        function removeChild(parentImageNode, parentTextNode, timeout) {
            setTimeout(function() {
                parentImageNode.style.transitionDuration = 0 + 's';
                while(parentImageNode.children.length > 1) {
                    parentImageNode.removeChild(parentImageNode.firstElementChild) 
                }
                parentImageNode.style.transform = `translateY(0%)`;

                parentTextNode.style.transitionDuration = 0 + 's';
                while(parentTextNode.children.length > 1) {
                    parentTextNode.removeChild(parentTextNode.firstElementChild) 
                }
                parentTextNode.style.transform = `translateY(0%)`;

                // Разрешаем клик по завершению анимации
                allowToSlide = true;
            },timeout)
        
        }

       /**
        * Сдвигаем слайдер
        * @param  {number} k на какое количество сдвигаем слайдер
        * @return {Void}
        */
        function shiftRight(k){
            for(var j = 0; j < k; j ++){
                var tmp = circleItems[0];
            
                for (var i = 0; i < circleItems.length - 1; i ++){
                    circleItems[i] = circleItems[i + 1];
                }
        
                circleItems[circleItems.length - 1] =  tmp;
            }
        }

        /**
        * Добавляем transition
        * @param  {number} circleItemIndex индекс элемента на который нажали
        * @return {number} transitionTime время анимации
        */
        function setTransition(circleItemIndex){
            var transitionTime;

            if(circleItemIndex <= 1){
                transitionTime = circleItemIndex;
            }else{
                transitionTime = circleItemIndex * TRANSITION_COF;
            }

            roundBorderCircle.style.transitionDuration = transitionTime + 's';
            roundImgList.style.transitionDuration = transitionTime + 's';
            emblemList.style.transitionDuration = transitionTime + 's';

            for(var i = 0; i < numberLinks.length; i++){
                numberLinks[i].style.transitionDuration = transitionTime + 's';
            }; 

            return (transitionTime * 1000) + 50;
        }
        
        /**
        * Создаем массив картинок и текса
        * @return {Void}
        */
        function createInitState(){

            var roundImg1 = document.createElement('li');
            roundImg1.className = "round-img 1";
            roundImg1.style.backgroundImage = "url('./images/round-img1.jpg')";
    
            var roundImg2 = document.createElement('li');
            roundImg2.className = "round-img 2";
            roundImg2.style.backgroundImage = "url('./images/round-img2.jpg')";
    
            var roundImg3 = document.createElement('li');
            roundImg3.className = "round-img 3";
            roundImg3.style.backgroundImage = "url('./images/round-img3.jpg')";
    
            var roundImg4 = document.createElement('li');
            roundImg4.className = "round-img 4";
            roundImg4.style.backgroundImage = "url('./images/round-img4.jpg')";

            var emblemItem1 = document.createElement('li');
            emblemItem1.className = "emblem-item";
            emblemItem1.innerHTML = "Более <strong>6 лет</strong> <br>на рынке застройщиков Геленджика";
    
            var emblemItem2 = document.createElement('li');
            emblemItem2.className = "emblem-item";
            emblemItem2.innerHTML = "Сдано <strong>8</strong> многоквартирных <strong>домов</strong>";
    
            var emblemItem3 = document.createElement('li');
            emblemItem3.className = "emblem-item";
            emblemItem3.innerHTML = "<strong>Соответствие</strong> объектов <strong>требованиям</strong> <br>по строительству и планированию";
    
            var emblemItem4 = document.createElement('li');
            emblemItem4.className = "emblem-item";
            emblemItem4.innerHTML = "Все квартиры <br>с <strong>предчистовой отделкой</strong>. Вы можете создать свой дизайн сами!";

            imagesArray.push(roundImg1, roundImg2, roundImg3, roundImg4);
            textArray.push(emblemItem1, emblemItem2, emblemItem3, emblemItem4);
        }

    }

}());
