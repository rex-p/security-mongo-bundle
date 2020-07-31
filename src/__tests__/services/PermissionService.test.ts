import { SecurityService, PermissionService } from "@kaviar/security-bundle";
import { permissionServiceTestDefinitions } from "@kaviar/security-bundle/dist/__tests__/reusable";
import { createEcosystem } from "../ecosystem";

describe("PermissionService", () => {
  permissionServiceTestDefinitions.forEach(({ message, test }) => {
    it(message, async () => {
      const { container, teardown } = await createEcosystem();
      const service = container.get(PermissionService);

      await test(service);
      await teardown();
    });
  });
});
