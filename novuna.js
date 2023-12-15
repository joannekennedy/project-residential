<script type="text/javascript">

    var formContainer = document.querySelector(".product-form");
    var formID = formContainer.getAttribute("id");  
    var novCont, curr_variation;
    novCont = $('.appinbox-product-finance-highlight-box');
    novCont.hide();
    var productId = ;
    var novunaFinanceURL = '';
    var sectionId = 'template--product__main';
    var productFormID = '#'+formID;
    var variantIdSelector = "#product-form-installment-" + sectionId + "-" + productId;
    var variantFormSelect = variantIdSelector + ' input[name="id"]';
    
    $(document).ready(function() {

        //Showing iframe on click - view options button
        $('.appinbox-product-apply-now').on('click', function() {
            $('#Nou_popupiframe').addClass('active');
            $('body').addClass('modal-open');
        });

        //Hiding iframe on click - close button
        $('#Nou_popupiframe.modal span.close').on('click', function() {
            $('#Nou_popupiframe').slideUp('fast');
            $('#Nou_popupiframe').removeClass('active');
            $('body').removeClass('modal-open');
        });

        //Getting the variation ID on page load
        onLoad_variation = $(variantFormSelect).val();
        console.log(onLoad_variation);

        //With New API - Updating the Finance box on page load
        $.ajax({
            url: novunaFinanceURL+'/api/v1/finance/product-page?pId=8713244213531&vId='+onLoad_variation,
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
                    var srcval = novunaFinanceURL+'/v1/iframe/product-page?pId='+productId+'&vId='+onLoad_variation;
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
        
        // Theme level change
        $(variantFormSelect).bind("change paste keyup", function() {
            curr_variation = $(this).val();
            console.log(curr_variation);
            $.ajax({
                url: novunaFinanceURL+'/api/v1/finance/product-page?pId=8713244213531&vId='+curr_variation,
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
                     var srcval = novunaFinanceURL+'/v1/iframe/product-page?pId='+productId+'&vId='+curr_variation;
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
}); 
</script>