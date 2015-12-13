/* Author: Dror Liebenthal */

/*
 * jQuery functions for disabling and enabling input fields and for
 * handling animation of the pop up information bars.
 */

$(document).ready(function()
{
    /*
     * Radio button handler
     */
    $('input:radio[name="mod"]').change(
    function()
    {
        // Reset and disable non-relevant fields for SI model
        if ($(this).val() == 'SI') 
        {
            $("#rR").val('10');
            $("#rR").prop('disabled',true);
            $("#iR").val('0');
            $("#iR").prop('disabled', true);
        }
        
        // Enable relevant fields for SIR model
        else if ($(this).val() == 'SIR')
        {
            $("#rR").prop('disabled', false);
            $("#iR").prop('disabled', false);
        }
        // SIS model
        else
        {
            $("#rR").prop('disabled', false);
            $("#iR").val('0');
            $("#iR").prop('disabled', true);
        }
    });
    
    // Pop up information bar handler.
    // Ensures only one information bar is displayed at a time.
    $(".btn-slide").click(function()
    {
        $(this).parent().siblings(".infoPanel").slideToggle("slow");
        $(this).parent().parent().siblings().children('.infoPanel:visible').slideToggle("slow");
        return false;
    });
});