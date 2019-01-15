var tar=document.querySelector('#tar')
var antar=document.querySelector('pre')
var moretar=document.querySelector('code')
function addClass(element, newClassName) {
    // your implement
    var tem=element.className;
    tem+=' '+newClassName
    //element.className=tem;
    element.className+=' '+newClassName;

}
function removeClass(element, oldClassName) {
    // your implement
    var tem=element.className.replace(oldClassName,"").trim();//replace是返回新字符串
    element.className=tem;
}
function isSiblingNode(element, siblingNode) {
    // your implement
    if(element.parentNode == siblingNode.parentNode)
        return true;
    return false;
}

function getoffsetX(element){
    if( element == document.body)
        return 0;

    return element.offsetLeft+getoffsetX(element.parentNode)
}
function getoffsetY(element){
    if( element == document.body)
        return 0;
    return element.offsetTop+getoffsetY(element.parentNode)
}
function getPosition(element) {
    // your implement
    var tem={}
    tem["X"]=getoffsetX(element);
    tem["Y"]=getoffsetY(element);
    return tem;
}

addClass(tar,'newclass')
removeClass(tar,'newclass')
console.log(isSiblingNode(tar,antar))
console.log(isSiblingNode(tar,moretar))
var off=getPosition(tar);