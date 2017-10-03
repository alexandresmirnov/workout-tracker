$(document).ready(function(){

    $('.days a').click(function(){

        let target = '.'+$(this).attr('href').substr(1);

        console.log(target);
        console.log($(target));
        console.log($('div'));
        console.log($('div.d2017-2-19'))

        $('.day').addClass('hidden');
        $(target).removeClass('hidden');

        return false;
    });

});
