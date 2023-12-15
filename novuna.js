    var formContainer = document.querySelector(".w-commerce-commerceaddtocartform"); 
    var novCont;
    novCont = $('.appinbox-product-finance-highlight-box');
    novCont.hide();
    var productId = formContainer.getAttribute("data-commerce-product-id");  
    var branchId = "70421700";
    var clientId = "0e8d79ef7bd8287145c1acc0e2b9124a";
    var clientSecret = "789e13a40e764a20062903a30f66208933421e3e6ec5a7fceb8101908723b286";
    var novunaFinanceURL = 'https://credit.demo.paybyfinance.co.uk/application/{applicationId}';
    console.log("script loaded");
    
    $(document).ready(function() {

        console.log("document ready");

        //Showing iframe on click - view options button
        $('.appinbox-product-apply-now').on('click', function() {
            $('#Nou_popupiframe').addClass('active');
            $('body').addClass('modal-open');
            console.log("element clicked");
        });

        //Hiding iframe on click - close button
        $('#Nou_popupiframe.modal span.close').on('click', function() {
            $('#Nou_popupiframe').slideUp('fast');
            $('#Nou_popupiframe').removeClass('active');
            $('body').removeClass('modal-open');
            console.log("element closed");
        });

        //With New API - Updating the Finance box on page load
        $.ajax({
            url: novunaFinanceURL+'/api/v1/finance/product-page?pId='+productId,
            dataType: 'json',
            cache: false,
            success: function(result) {
                var financeStatus = result.status;
                if(financeStatus==='true'){
                    var monthlyEmi = result.data.monthly_emi;
                    var apr = result.data.apr;
                    novCont.show();
                    var financeHighlightText = 'From £' + monthlyEmi + ' per month';
                    $('.appinbox-product-finance-highlight-text span.monthAmt').html(financeHighlightText);

                    //Passing the value to iframe
                    var srcval = novunaFinanceURL+'/v1/iframe/product-page?pId='+productId;
                    $('#Nou_popupiframe #novuna_iframe').attr('src', srcval);
                    $("#Nou_popupiframe #novuna_iframe").on("load", function() {
                        $("#loader").remove();
                    });

                } else{
                    novCont.hide();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
            }
        });
        
}); 
