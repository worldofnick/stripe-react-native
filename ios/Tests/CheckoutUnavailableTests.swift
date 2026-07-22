@testable import stripe_react_native
import StripePaymentSheet
import XCTest

class CheckoutUnavailableTests: XCTestCase {
    func testInitCheckoutSessionRejectsWithTemporaryError() {
        var rejectedCode: String?
        var rejectedMessage: String?

        StripeSdkImpl.shared.initCheckoutSession(
            clientSecret: "cs_test_secret_test",
            configuration: [:],
            resolver: { _ in
                XCTFail("Checkout initialization should not resolve while native support is unavailable.")
            },
            rejecter: { code, message, _ in
                rejectedCode = code
                rejectedMessage = message
            }
        )

        XCTAssertEqual(rejectedCode, ErrorType.Failed)
        XCTAssertEqual(rejectedMessage, StripeSdkImpl.checkoutUnavailableMessage)
    }

    func testPaymentSheetCheckoutReturnsStructuredTemporaryError() {
        var result: NSDictionary?
        var configuration = PaymentSheet.Configuration()
        configuration.merchantDisplayName = "Test"

        StripeSdkImpl.shared.preparePaymentSheetInstance(
            params: ["checkout": ["sessionKey": "checkout-key"]],
            configuration: configuration,
            resolve: { value in
                result = value as? NSDictionary
            }
        )

        let error = result?["error"] as? NSDictionary
        XCTAssertEqual(error?["code"] as? String, ErrorType.Failed)
        XCTAssertEqual(error?["message"] as? String, StripeSdkImpl.checkoutUnavailableMessage)
    }
}
